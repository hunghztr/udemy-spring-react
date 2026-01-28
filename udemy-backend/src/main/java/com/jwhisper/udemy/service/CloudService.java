package com.jwhisper.udemy.service;

import java.util.Map;

public interface CloudService {
    Map<String,Object> getSignature(String folder);
    // StringResult uploadImage(MultipartFile file,String id,String folder) throws IOException;
    // VideoResponse uploadVideo(MultipartFile file,String id,String folder) throws IOException;
}
