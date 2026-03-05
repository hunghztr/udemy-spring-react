package com.jwhisper.udemy.controller.client;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cloudinary.api.ApiResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.CloudService;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@Slf4j
@RestController
@RequestMapping("/api/v1/files")
public class FileController {
    private final CloudService cloudService;
    public FileController(CloudService cloudService){
        this.cloudService = cloudService;
    }

    @GetMapping("/signature/{folder}")
    @ApiMessage("Lấy chữ kí thành công")
    public ResponseEntity<?> getSignature(@PathVariable("folder") String folder) {
        Map<String,Object> signature = this.cloudService.getSignature(folder); 
        return ResponseEntity.ok().body(signature);
    }
    @GetMapping("/signature-destroy")
    @ApiMessage("Lấy chữ kí xoá file thành công")
    public ResponseEntity<?> getSingnatureDestroy(@RequestParam("publicId") String publicId) {
        Map<String,Object> signature = this.cloudService.getDestroySignature(publicId);
        return ResponseEntity.ok(signature);
    }
    @PostMapping("/delete-files-by-ids")
    @ApiMessage("Xoá danh sách file video thành công")
    public ResponseEntity<?> deleteAll(@RequestBody List<String> publicIds) {
        ApiResponse apiResponse = this.cloudService.deleteByPublicIds(publicIds, "video");
        return ResponseEntity.ok(apiResponse);
    }
    
    
}
