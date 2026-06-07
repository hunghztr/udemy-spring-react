package com.jwhisper.udemy.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.user.InstructorRevenueResponse;
import com.jwhisper.udemy.model.InstructorPayout;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.repository.InstructorPayoutRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.service.InstructorPayoutService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class InstructorPayoutServiceImpl implements InstructorPayoutService  {
    InstructorPayoutRepository instructorPayoutRepository;
    UserRepository userRepository;
    
    public InstructorPayoutServiceImpl(InstructorPayoutRepository instructorPayoutRepository,
            UserRepository userRepository) {
        this.instructorPayoutRepository = instructorPayoutRepository;
        this.userRepository = userRepository;
    }

    @Override
    public InstructorRevenueResponse getInstructorRevenue(String instructorId) {
        User instructor = userRepository.findById(instructorId)
            .orElseThrow(() -> new EntityNotFoundException("Instructor not found"));

        List<InstructorPayout> payouts = instructorPayoutRepository
            .findByInstructorId(instructorId);

        double totalRevenue = payouts.stream()
            .mapToDouble(p -> p.getAmount())
            .sum();

        // Group by course
        Map<String, List<InstructorPayout>> byCourse = payouts.stream()
            .collect(Collectors.groupingBy(p -> p.getCourse().getId()));

        List<InstructorRevenueResponse.CourseRevenueDetail> courseDetails = byCourse
            .entrySet().stream()
            .map(entry -> {
                InstructorPayout first = entry.getValue().get(0);
                double revenue = entry.getValue().stream()
                    .mapToDouble(InstructorPayout::getAmount)
                    .sum();

                return InstructorRevenueResponse.CourseRevenueDetail.builder()
                    .courseId(first.getCourse().getId())
                    .courseName(first.getCourse().getName())
                    .revenue(revenue)
                    .sold(first.getCourse().getSold())
                    .build();
            })
            .collect(Collectors.toList());

        return InstructorRevenueResponse.builder()
            .instructorId(instructorId)
            .instructorName(instructor.getFullname())
            .totalRevenue(totalRevenue)
            .courseDetails(courseDetails)
            .build();
    }
}
