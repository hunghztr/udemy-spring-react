package com.jwhisper.udemy.service.impl;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.document.CourseDocument;
import com.jwhisper.udemy.dto.Pagination;
import com.jwhisper.udemy.dto.course.CourseSearchResponse;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.ESCourseMapper;
import com.jwhisper.udemy.model.Course;
import com.jwhisper.udemy.repository.CourseRepository;
import com.jwhisper.udemy.repository.ESCourseRepository;
import com.jwhisper.udemy.service.SearchService;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;

@Service
public class SearchServiceImpl implements SearchService {
    private final ESCourseRepository esCourseRepository;
    private final CourseRepository courseRepository;
    private final ESCourseMapper esCourseMapper;
    private final ElasticsearchOperations elasticsearchOperations;
    public SearchServiceImpl(ESCourseRepository esCourseRepository,
        CourseRepository courseRepository,ESCourseMapper esCourseMapper,
        ElasticsearchOperations elasticsearchOperations
    ){
        this.esCourseRepository = esCourseRepository;
        this.courseRepository = courseRepository;
        this.esCourseMapper = esCourseMapper;
        this.elasticsearchOperations = elasticsearchOperations;
    }
    @Override
    public void indexCourse(String courseId) {
        Course course = this.courseRepository.findByIdWithCategories(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        CourseDocument document = this.esCourseMapper.toCourseDocument(course);
        this.esCourseRepository.save(document);
    }


    @Override
    public void deleteCourse(String courseId) {
        this.courseRepository.findById(courseId)
        .orElseThrow(() -> new ErrorException("Khoá học không tồn tại"));
        this.esCourseRepository.deleteById(courseId);
    }
    @Override
    public Pagination<CourseSearchResponse> searchFuzzi(Pageable pageable, String keyword) {
        NativeQuery query = NativeQuery.builder()
        .withQuery(q -> q
            .multiMatch(mm -> mm
                .query(keyword)
                .fields("name^3", "description")
                .fuzziness("AUTO")
                .prefixLength(2)
                .operator(Operator.Or)
            )
        )
        .withSort(s -> s.score(sc -> sc.order(SortOrder.Desc)))
        .withSort(s -> s.field(f -> f.field("sold").order(SortOrder.Desc)))
        .withSort(s -> s.field(f -> f.field("price").order(SortOrder.Asc)))
        .withPageable(pageable)
        .build();

        SearchHits<CourseDocument> hits =
        elasticsearchOperations.search(query, CourseDocument.class);
        List<CourseSearchResponse> responses = hits.getSearchHits().stream()
        .map(hit -> this.esCourseMapper.toCourseSearchResponse(hit.getContent())).toList();
        Pagination<CourseSearchResponse> pagination = new Pagination<>();
        Pagination.Meta meta = new Pagination.Meta();
        meta.setCurrentPage(pageable.getPageNumber());
        meta.setPageSize(pageable.getPageSize());
        meta.setPageTotals((int) Math.ceil((double) hits.getTotalHits() / pageable.getPageSize()));
        meta.setElementTotals(hits.getTotalHits());
        pagination.setElements(responses);
        pagination.setMeta(meta);
        return pagination;
    }
    
}
