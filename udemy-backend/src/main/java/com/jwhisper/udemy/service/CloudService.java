package com.jwhisper.udemy.service;

import java.util.List;
import java.util.Map;

import com.cloudinary.api.ApiResponse;

public interface CloudService {
    Map<String,Object> getSignature(String folder);
    Map<String, Object> getDestroySignature(String publicId);
    ApiResponse  deleteByPublicIds(List<String> publicIds, String resourceType);
}
