package com.jwhisper.udemy.service.impl;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jwhisper.udemy.service.CloudService;

@Service
public class CloudServiceImpl implements CloudService {

    private final Cloudinary cloudinary;

    public CloudServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadAvatar(MultipartFile file, String userId) throws IOException {
        String publicId = "avatar_" + userId;
        @SuppressWarnings("unchecked")
        Map<String,Object> uploadResult = (Map<String,Object>) cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "avatars",
                        "public_id", publicId,
                        "overwrite", true,
                        "resource_type", "image"
                )
        );

        return uploadResult.get("secure_url").toString();
    }

    @Override
    public String uploadImage(MultipartFile file) throws IOException {

        @SuppressWarnings("unchecked")
        Map<String,Object> uploadResult = (Map<String,Object>)cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "images",
                        "resource_type", "image"
                )
        );

        return uploadResult.get("secure_url").toString();
    }

    @Override
    public String uploadVideo(MultipartFile file) throws IOException {

        @SuppressWarnings("unchecked")
        Map<String,Object> uploadResult = (Map<String,Object>)cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "videos",
                        "resource_type", "video"
                )
        );

        return uploadResult.get("secure_url").toString();
    }
}
