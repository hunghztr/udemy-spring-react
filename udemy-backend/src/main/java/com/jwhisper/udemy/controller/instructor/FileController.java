package com.jwhisper.udemy.controller.instructor;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.CloudService;
import lombok.extern.slf4j.Slf4j;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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
    
}
