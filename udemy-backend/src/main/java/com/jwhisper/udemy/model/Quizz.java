package com.jwhisper.udemy.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "quizzs")
public class Quizz {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String question;

    @ElementCollection
    @CollectionTable(
        name = "quizz_options",
        joinColumns = @JoinColumn(name = "quizz_id")
    )
    @Column(name = "option_text")
    List<String> options;

    String answer;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    Section section;
}
