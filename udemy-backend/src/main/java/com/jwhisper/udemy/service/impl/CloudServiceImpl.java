package com.jwhisper.udemy.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;
import com.cloudinary.utils.ObjectUtils;
import com.jwhisper.udemy.service.CloudService;

@Service
public class CloudServiceImpl implements CloudService {

    private final Cloudinary cloudinary;
    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.cloud-name}")
    private String cloudName;
    public CloudServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public Map<String, Object> getSignature(String folder) {
        long timestamp = System.currentTimeMillis() / 1000;

        Map<String, Object> params = new HashMap<>();
        params.put("timestamp", timestamp);
        params.put("folder", folder);
        String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret);

        Map<String, Object> res = new HashMap<>();
        res.put("timestamp", timestamp);
        res.put("signature", signature);
        res.put("apiKey", apiKey);
        res.put("cloudName", cloudName);
        res.put("folder",folder);
        return res;
    }
    @Override
    public Map<String, Object> getDestroySignature(String publicId) {
        long timestamp = System.currentTimeMillis() / 1000;

        Map<String, Object> params = new HashMap<>();
        params.put("timestamp", timestamp);
        params.put("public_id", publicId);

        String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret);

        Map<String, Object> res = new HashMap<>();
        res.put("timestamp", timestamp);
        res.put("signature", signature);
        res.put("apiKey", apiKey);
        res.put("cloudName", cloudName);
        res.put("publicId", publicId);
        return res;
    }

    @Override
    public ApiResponse  deleteByPublicIds(List<String> publicIds, String resourceType) {
        try {
            return cloudinary.api().deleteResources(
                    publicIds,
                    ObjectUtils.asMap(
                            "resource_type", resourceType, // image | video | raw
                            "invalidate", true
                    )
            );
        } catch (Exception e) {
            throw new RuntimeException("Cloudinary bulk delete failed", e);
        }
    }

}
