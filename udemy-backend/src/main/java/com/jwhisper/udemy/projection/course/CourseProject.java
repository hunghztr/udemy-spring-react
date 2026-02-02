package com.jwhisper.udemy.projection.course;

import com.jwhisper.udemy.helper.constant.CourseStatus;

public interface CourseProject {
    String getId();
    String getName();
    int getStar();
    int getSold();
    double getHour();
    CourseStatus getStatus();
}
