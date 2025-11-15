package com.jwhisper.udemy.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "orders")
@Data
@EqualsAndHashCode(callSuper = false)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order extends DefaultModel {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  @Column(columnDefinition = "DECIMAL(10,2)")
  double price;
  int total;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "customer_id")
  User customer;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "order_detail", joinColumns = @JoinColumn(name = "order_id"), inverseJoinColumns = @JoinColumn(name = "course_id"))
  List<Course> courses;

  @JsonIgnore
  @OneToOne(fetch = FetchType.LAZY, mappedBy = "order")
  InstructorPayout instructorPayout;
}
