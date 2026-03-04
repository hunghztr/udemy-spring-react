package com.jwhisper.udemy.helper.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.jwhisper.udemy.helper.constant.ActivityAction;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogActivity {
    ActivityAction action();
    String resource() default "";
    int resourceIdIndex() default -1;
    String resourceIdField() default "id";
}
