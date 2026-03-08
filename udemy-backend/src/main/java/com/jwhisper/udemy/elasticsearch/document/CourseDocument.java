package com.jwhisper.udemy.elasticsearch.document;

import java.util.List;

import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.WriteTypeHint;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(indexName = "courses",writeTypeHint = WriteTypeHint.FALSE)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDocument {

    @Id
    private String id;

    /* ================= SEARCH ================= */

    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    /* ================= FILTER ================= */

    @Field(type = FieldType.Keyword)
    private List<String> categories;

    /* ================= RANKING ================= */

    @Field(type = FieldType.Double)
    private double star;

    @Field(type = FieldType.Integer)
    private int sold;

    /* ================= SORT / FILTER ================= */

    @Field(type = FieldType.Double)
    private double price;

    @Field(type = FieldType.Double)
    private double hour;

    /* ================= DISPLAY ================= */

    @Field(type = FieldType.Keyword)
    private String imagePath;

    @Field(type = FieldType.Keyword)
    private String authorName;

}
