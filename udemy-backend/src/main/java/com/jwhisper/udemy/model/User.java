package com.jwhisper.udemy.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jwhisper.udemy.helper.constant.LoginMethod;

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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "users")
@Data
@EqualsAndHashCode(callSuper = false)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User extends DefaultModel {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String username;
  String password;
  String fullname;
  @Enumerated(EnumType.STRING)
  LoginMethod method;
  String avatarPath;
  @Column(columnDefinition = "TEXT")
  String description;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "role_id")
  Role role;

  @JsonIgnore
  @OneToOne(mappedBy = "user", fetch = FetchType.LAZY,cascade = CascadeType.ALL,orphanRemoval = true)
  Cart cart;

  @JsonIgnore
  @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
  List<Course> courses;

  @JsonIgnore
  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  List<Notification> notifications;

  @JsonIgnore
  @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
  List<Learning> learnings;

  @JsonIgnore
  @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
  List<Rating> ratings;

  @JsonIgnore
  @OneToMany(mappedBy = "viewer", fetch = FetchType.LAZY)
  List<Comment> comments;

  @JsonIgnore
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "customer")
  List<Order> orders;

  @JsonIgnore
  @OneToMany(mappedBy = "instructor")
  List<InstructorPayout> instructorPayouts;
}
