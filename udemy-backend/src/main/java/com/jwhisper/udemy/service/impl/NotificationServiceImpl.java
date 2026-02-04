package com.jwhisper.udemy.service.impl;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.SliceResponse;
import com.jwhisper.udemy.dto.notification.NotificationRequest;
import com.jwhisper.udemy.dto.notification.NotificationResponse;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.helper.mapper.NotificationMapper;
import com.jwhisper.udemy.model.Notification;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.repository.NotificationRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.NotificationService;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class NotificationServiceImpl  implements NotificationService{
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;
    private final SecurityHelper securityHelper;
    private final SseComponent sseComponent;
    public NotificationServiceImpl(NotificationRepository notificationRepository,
        NotificationMapper notificationMapper,UserRepository userRepository,
        SecurityHelper securityHelper,SseComponent sseComponent
    ){
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
        this.userRepository = userRepository;
        this.securityHelper = securityHelper;
        this.sseComponent = sseComponent;
    }
    @Override
    public boolean sendRequest(NotificationRequest request) {
        User receiver = this.userRepository.findByUsername(request.getUser().getUsername())
        .orElseThrow(() -> new ErrorException("Người nhận không tồn tại"));
        Notification notification = this.notificationMapper.toNotification(request);
        notification.setUser(receiver);
        notification = this.notificationRepository.save(notification);
        sseComponent.send(receiver.getUsername(),
         this.notificationMapper.toNotificationResponse(notification));
        return true;
    }
    @Override
    public SliceResponse<NotificationResponse> getAll(Pageable pageable) {
        String username = this.securityHelper.getCurrentUsername();
        var user = this.userRepository.findProjectByUsername(username);
        if(user == null) throw new ErrorException("Người dùng không tồn tại");
        Slice<Notification> slice = this.notificationRepository.findAllByUser_Id(user.getId(),pageable);
        Slice<NotificationResponse> responses = slice
        .map(n -> this.notificationMapper.toNotificationResponse(n));
        SliceResponse<NotificationResponse> sliceResponse = new SliceResponse<>();
        sliceResponse.setItems(responses.getContent());
        sliceResponse.setHasNext(slice.hasNext());
        return sliceResponse;
    }
    @Override
    public boolean mark(String id) {
        Notification notification = this.notificationRepository.findById(id)
        .orElseThrow(() -> new ErrorException("Thông báo không tồn tại"));
        if(notification.isRead()) throw new ErrorException("Thông báo này đã đọc rồi");
        notification.setRead(true);
        this.notificationRepository.save(notification);
        return true;
    }
    @Override
    public long countNew() {
        String username = this.securityHelper.getCurrentUsername();
        var user = this.userRepository.findProjectByUsername(username);
        if(user==null) throw new ErrorException("Người dùng không tồn tại");
        return this.notificationRepository.countByUser_IdAndIsReadFalse(user.getId());
    }
    @Override
    @Transactional
    public boolean delete(String id) {
        String username = this.securityHelper.getCurrentUsername();
        var user = this.userRepository.findProjectByUsername(username);
        if(user == null) throw new ErrorException("Người dùng không tồn tại");
        this.notificationRepository.deleteByIdAndUser_Id(id, user.getId());
        return true;
    }
    
}
