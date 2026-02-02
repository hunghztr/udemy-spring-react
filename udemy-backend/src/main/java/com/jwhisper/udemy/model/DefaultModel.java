package com.jwhisper.udemy.model;

import java.time.Instant;

import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@MappedSuperclass
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DefaultModel {
  Instant createdAt;
  Instant updatedAt;
  Boolean isActive;

  @PrePersist
  public void PrePersist() {
    this.createdAt = Instant.now();
    if (this.isActive == null) {
        this.isActive = true;
    }
  }

  @PreUpdate
  public void PreUpdate() {
    this.updatedAt = Instant.now();
  }
}
