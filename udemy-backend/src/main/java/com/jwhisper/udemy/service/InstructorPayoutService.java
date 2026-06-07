package com.jwhisper.udemy.service;

import com.jwhisper.udemy.dto.user.InstructorRevenueResponse;

public interface InstructorPayoutService {
    InstructorRevenueResponse getInstructorRevenue(String instructorId);
    
}
