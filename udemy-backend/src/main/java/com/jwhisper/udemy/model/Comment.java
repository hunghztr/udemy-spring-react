package com.jwhisper.udemy.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "comments")
@Data
@EqualsAndHashCode(callSuper = false)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comment extends DefaultModel {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String title;
  String content;
  int time;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parent_id")
  Comment commentParent;
  @JsonIgnore
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "commentParent")
  List<Comment> comments;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "lecture_id")
  Lecture lecture;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "viewer_id")
  User viewer;

}
