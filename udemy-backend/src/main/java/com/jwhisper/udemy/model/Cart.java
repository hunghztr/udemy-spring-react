package com.jwhisper.udemy.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "carts")
@Data
@EqualsAndHashCode(callSuper = false)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Cart extends DefaultModel {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  @Column(columnDefinition = "DECIMAL(10,2)")
  double price;
  int total;
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  User user;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "cart_detail", joinColumns = @JoinColumn(name = "cart_id"), inverseJoinColumns = @JoinColumn(name = "course_id"))
  List<Course> courses;
}
