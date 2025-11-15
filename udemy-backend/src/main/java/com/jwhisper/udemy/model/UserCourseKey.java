package com.jwhisper.udemy.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Embeddable
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCourseKey implements Serializable {

  @Column(name = "customer_id")
  String userId;

  @Column(name = "course_id")
  String courseId;
}
