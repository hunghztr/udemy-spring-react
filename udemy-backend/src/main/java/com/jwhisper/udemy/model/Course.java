package com.jwhisper.udemy.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jwhisper.udemy.helper.constant.CourseStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "courses")
@Data
@EqualsAndHashCode(callSuper = false)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Course extends DefaultModel {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  @Column(columnDefinition = "DECIMAL(10,2)")
  double price;
  String name;
  @Enumerated(EnumType.STRING)
  CourseStatus status;
  int sold;
  int star;
  @Column(columnDefinition = "TEXT")
  String description;
  @Column(columnDefinition = "TEXT")
  String requirement;
  double hour;
  int totalSection;
  String imagePath;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_id")
  User author;

  @JsonIgnore
  @ManyToMany(fetch = FetchType.LAZY, mappedBy = "courses")
  List<Cart> carts;

  @JsonIgnore
  @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
  List<Learning> learnings;
  @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
  List<Rating> ratings;

  @JsonIgnore
  @OneToMany(mappedBy = "course", fetch = FetchType.LAZY,cascade = CascadeType.ALL,orphanRemoval = true)
  List<Coupon> coupons;

  @JsonIgnore
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "course_category",
      joinColumns = @JoinColumn(name = "course_id"),
      inverseJoinColumns = @JoinColumn(name = "category_id")
  )
  List<Category> categories;

  @JsonIgnore
  @OneToMany(mappedBy = "course", fetch = FetchType.LAZY,cascade = CascadeType.ALL,orphanRemoval = true)
  @OrderBy("createdAt ASC")
  List<Section> sections;

  @JsonIgnore
  @ManyToMany(mappedBy = "courses", fetch = FetchType.LAZY)
  List<Order> orders;
}
