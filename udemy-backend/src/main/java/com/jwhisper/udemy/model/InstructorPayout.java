package com.jwhisper.udemy.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "instructor_payouts")
@Data
@EqualsAndHashCode(callSuper = false)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InstructorPayout extends DefaultModel {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  @Column(columnDefinition = "DECIMAL(10,2)")
  double amount;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id")
  Order order;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "instructor_id")
  User instructor;
}
