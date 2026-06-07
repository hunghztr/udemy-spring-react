package com.jwhisper.udemy.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.InstructorPayout;
import com.jwhisper.udemy.model.User;

@Repository
public interface InstructorPayoutRepository extends JpaRepository<InstructorPayout,String> {
    List<InstructorPayout> findAllByInstructor(User instructor);
    List<InstructorPayout> findAllByInstructorAndCreatedAtBetween(
            User instructor,
            Instant startDate,
            Instant endDate
    );
    @Query("""
    SELECT COALESCE(SUM(p.amount),0)
    FROM InstructorPayout p
    WHERE p.instructor = :instructor
    """)
    Double sumAmountByInstructor(User instructor);
    @Query("""
    SELECT COALESCE(SUM(p.amount),0)
    FROM InstructorPayout p
    WHERE p.instructor = :instructor
    AND p.createdAt BETWEEN :startDate AND :endDate
    """)
    Double sumAmountByInstructorAndDate(
            User instructor,
            Instant startDate,
            Instant endDate
    );
    List<InstructorPayout> findByInstructorId(String instructorId);

    @Query("""
        SELECT COALESCE(SUM(p.amount), 0)
        FROM InstructorPayout p
        WHERE p.instructor.id = :instructorId
    """)
    double sumAmountByInstructorId(@Param("instructorId") String instructorId);

    @Query("""
        SELECT COALESCE(SUM(p.amount), 0)
        FROM InstructorPayout p
        WHERE p.instructor.id = :instructorId
        AND p.course.id = :courseId
    """)
    double sumAmountByInstructorIdAndCourseId(
        @Param("instructorId") String instructorId,
        @Param("courseId") String courseId
    );
}
