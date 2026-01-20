package com.jwhisper.udemy.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface CloudService {
    String uploadAvatar(MultipartFile file,String userId) throws IOException;
    String uploadVideo(MultipartFile file) throws IOException;
    String uploadImage(MultipartFile file) throws IOException;
}
