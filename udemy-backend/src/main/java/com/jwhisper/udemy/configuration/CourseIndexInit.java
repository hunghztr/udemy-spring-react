package com.jwhisper.udemy.configuration;

import org.springframework.stereotype.Component;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import jakarta.annotation.PostConstruct;

@Component
public class CourseIndexInit {
    private final ElasticsearchClient client;

    public CourseIndexInit(ElasticsearchClient client) {
        this.client = client;
    }

    @PostConstruct
    public void createIndex() throws Exception {

        boolean exists = client.indices()
            .exists(e -> e.index("courses"))
            .value();

        if (exists) {
            return;
        }

        client.indices().create(c -> c
            .index("courses")
            .settings(s -> s
                .analysis(a -> a
                    .analyzer("course_analyzer", an -> an
                        .custom(ca -> ca
                            .tokenizer("standard")
                            .filter("lowercase", "asciifolding")
                        )
                    )
                )
            )
            .mappings(m -> m
                .properties("name", p -> p
                    .text(t -> t.analyzer("course_analyzer"))
                )
                .properties("description", p -> p
                    .text(t -> t.analyzer("course_analyzer"))
                )
                .properties("categories", p -> p.keyword(k -> k))
                .properties("rating", p -> p.float_(f -> f))
                .properties("sold", p -> p.long_(l -> l))
                .properties("price", p -> p.double_(d -> d))
                .properties("hour", p -> p.double_(d -> d))
                .properties("authorName", p -> p.keyword(k -> k))
                .properties("imagePath", p -> p.keyword(k -> k))

            )
        );
    }
}
