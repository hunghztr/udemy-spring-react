package com.jwhisper.udemy.projection.category;

public interface CategoryProjection {
    String getId();
    String getName();
    CategoryParentProjection getCategoryParent();    
}
