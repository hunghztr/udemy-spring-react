package com.jwhisper.udemy.elasticsearch;


import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchAggregation;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchAggregations;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.AggregationsContainer;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.elasticsearch.document.CourseDocument;
import com.jwhisper.udemy.redis.InterestedRedisService;
import com.jwhisper.udemy.security.SecurityHelper;

import co.elastic.clients.elasticsearch._types.aggregations.Aggregate;
import co.elastic.clients.elasticsearch._types.aggregations.StringTermsAggregate;
import co.elastic.clients.elasticsearch._types.aggregations.StringTermsBucket;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CategoryAnalyzeComponent {

    private final ElasticsearchOperations elasticsearchOperations;
    private final InterestedRedisService interestedRedisService;
    private final SecurityHelper securityHelper;
    public CategoryAnalyzeComponent(ElasticsearchOperations elasticsearchOperations,
        InterestedRedisService interestedRedisService,
        SecurityHelper securityHelper
    ){
        this.elasticsearchOperations = elasticsearchOperations;
        this.interestedRedisService = interestedRedisService;
        this.securityHelper = securityHelper;
    }

    @Async
    public void analyzerCategory(SearchHits<CourseDocument> hits){

        AggregationsContainer<?> aggregationsContainer = hits.getAggregations();

        if (aggregationsContainer instanceof ElasticsearchAggregations aggregations) {

            ElasticsearchAggregation categoryCountAggregation = aggregations.get("category_count");

            if (categoryCountAggregation != null) {

                Aggregate aggregate = categoryCountAggregation.aggregation().getAggregate();

                if (aggregate.isSterms()) {

                    StringTermsAggregate terms = aggregate.sterms();

                    List<CourseDocument> allCourses = new java.util.ArrayList<>();

                    for (StringTermsBucket bucket : terms.buckets().array()) {

                        String category = bucket.key().stringValue();
                        allCourses.addAll(findCoursesByCategory(category));
                    }

                    String username = securityHelper.getCurrentUsername();
                    if(username.equals("anonymousUser")) return;
                    List<CourseDocument> uniqueCourses =
                            allCourses.stream()
                                    .collect(java.util.stream.Collectors.collectingAndThen(
                                            java.util.stream.Collectors.toMap(
                                                    CourseDocument::getId,
                                                    c -> c,
                                                    (c1, c2) -> c1
                                            ),
                                            m -> m.values().stream().limit(10).toList()
                                    ));

                    interestedRedisService.setInterestedCourse(username, uniqueCourses);
                }
            }
        }
    }
    private List<CourseDocument> findCoursesByCategory(String category){

        NativeQuery query = NativeQuery.builder()
            .withQuery(q -> q
                .scriptScore(ss -> ss
                    .query(q2 -> q2
                        .term(t -> t
                            .field("categories")
                            .value(category)
                        )
                    )
                    .script(s -> s
                        .source("doc['sold'].value * 0.7 + doc['star'].value * 0.3")
                    )
                )
            )
            .withPageable(PageRequest.of(0,10))
            .build();

        SearchHits<CourseDocument> hits =
                elasticsearchOperations.search(query, CourseDocument.class);

        return hits.map(h -> h.getContent()).toList();
    }
}