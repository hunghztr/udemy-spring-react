package com.jwhisper.udemy.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "lectures")
@Data
@EqualsAndHashCode(callSuper = false)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Lecture extends DefaultModel {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String name;
  @Column(columnDefinition = "DECIMAL(5,2)")
  double second;
  String path;
  // Boolean isFinished;
  Integer position;
  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "section_id")
  Section section;

  @JsonIgnore
  @OneToMany(mappedBy = "lecture", fetch = FetchType.LAZY,cascade = CascadeType.ALL,orphanRemoval = true)
  List<Comment> comments;

  @JsonIgnore
  @OneToMany(mappedBy = "lecture",fetch = FetchType.LAZY,cascade = CascadeType.ALL,orphanRemoval = true)
  List<UserLectureProgress> userLectureProgresses;
}
