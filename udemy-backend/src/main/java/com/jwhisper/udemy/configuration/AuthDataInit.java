package com.jwhisper.udemy.configuration;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.model.Permission;
import com.jwhisper.udemy.model.Role;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.repository.PermissionRepository;
import com.jwhisper.udemy.repository.RoleRepository;
import com.jwhisper.udemy.repository.UserRepository;

@Service
public class AuthDataInit implements CommandLineRunner {

    private PermissionRepository permissionRepository;
    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public AuthDataInit(
            PermissionRepository permissionRepository,
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ){
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        long countPermission = permissionRepository.count();
        long countRole = roleRepository.count();
        long countUser = userRepository.count();

        List<Permission> permissions = new ArrayList<>();
        List<Role> roles = new ArrayList<>();

        if (countPermission == 0) {

            // ================= ADMIN =================
            permissions.add(new Permission(null,"get list course","COURSE","/api/v1/admin/courses","GET",null));
            permissions.add(new Permission(null,"delete soft course","COURSE","/api/v1/admin/courses/delete/{id}","POST",null));
            permissions.add(new Permission(null,"activate course","COURSE","/api/v1/admin/courses/active/{id}","POST",null));

            permissions.add(new Permission(null,"remove rating","RATING","/api/v1/admin/learnings/{userId}/{courseId}","DELETE",null));
            permissions.add(new Permission(null,"get ratings by user","RATING","/api/v1/admin/learnings/get-rating-by-user/{userId}/{courseId}","GET",null));

            permissions.add(new Permission(null,"get list category","CATEGORY","/api/v1/admin/categories","GET",null));
            permissions.add(new Permission(null,"create category","CATEGORY","/api/v1/admin/categories","POST",null));
            permissions.add(new Permission(null,"update category","CATEGORY","/api/v1/admin/categories/{id}","PUT",null));
            permissions.add(new Permission(null,"get category","CATEGORY","/api/v1/admin/categories/{id}","GET",null));
            permissions.add(new Permission(null,"delete soft category","CATEGORY","/api/v1/admin/categories/delete/{id}","POST",null));
            permissions.add(new Permission(null,"activate category","CATEGORY","/api/v1/admin/categories/active/{id}","POST",null));

            permissions.add(new Permission(null,"get list role","ROLE","/api/v1/admin/roles","GET",null));

            permissions.add(new Permission(null,"get list user","USER","/api/v1/admin/users","GET",null));
            permissions.add(new Permission(null,"create user","USER","/api/v1/admin/users","POST",null));
            permissions.add(new Permission(null,"get user","USER","/api/v1/admin/users/{id}","GET",null));
            permissions.add(new Permission(null,"update user","USER","/api/v1/admin/users/{id}","PUT",null));
            permissions.add(new Permission(null,"delete soft user","USER","/api/v1/admin/users/delete/{id}","POST",null));
            permissions.add(new Permission(null,"activate user","USER","/api/v1/admin/users/active/{id}","POST",null));
            permissions.add(new Permission(null,"get user by course","USER","/api/v1/admin/users/get-by-course/{courseId}","GET",null));
            permissions.add(new Permission(null,"get bought course","USER","/api/v1/admin/users/get-bought-courses/{username}","GET",null));

            permissions.add(new Permission(null,"get list wallet","WALLET","/api/v1/admin/wallets","GET",null));
            permissions.add(new Permission(null,"get wallet by user","WALLET","/api/v1/admin/wallets/{userId}","GET",null));

            // ================= INSTRUCTOR =================
            permissions.add(new Permission(null,"create coupon","COUPON","/api/v1/instructor/coupons/{courseId}","POST",null));
            permissions.add(new Permission(null,"get list coupon","COUPON","/api/v1/instructor/coupons/{courseId}","GET",null));
            permissions.add(new Permission(null,"remove coupon","COUPON","/api/v1/instructor/coupons/delete/{id}","POST",null));
            permissions.add(new Permission(null,"update coupon","COUPON","/api/v1/instructor/coupons/{courseId}/update/{id}","PUT",null));

            permissions.add(new Permission(null,"create course","COURSE","/api/v1/instructor/courses","POST",null));
            permissions.add(new Permission(null,"get list course by instructor","COURSE","/api/v1/instructor/courses/get-courses-by-author","GET",null));
            permissions.add(new Permission(null,"get course","COURSE","/api/v1/instructor/courses/{id}","GET",null));

            permissions.add(new Permission(null,"update desc course","COURSE","/api/v1/instructor/courses/description/{id}","PUT",null));
            permissions.add(new Permission(null,"create section","COURSE","/api/v1/instructor/courses/section/{courseId}","POST",null));
            permissions.add(new Permission(null,"update section name","COURSE","/api/v1/instructor/courses/{courseId}/section/{id}","PUT",null));
            permissions.add(new Permission(null,"update lecture name","COURSE","/api/v1/instructor/courses/{courseId}/lecture/{id}","PUT",null));

            permissions.add(new Permission(null,"remove section","COURSE","/api/v1/instructor/courses/{courseId}/delete/section/{id}","DELETE",null));
            permissions.add(new Permission(null,"remove lecture","COURSE","/api/v1/instructor/courses/{courseId}/delete/lecture/{id}","DELETE",null));

            permissions.add(new Permission(null,"create lecture","COURSE","/api/v1/instructor/courses/lecture/{id}","POST",null));
            permissions.add(new Permission(null,"update lecture video","COURSE","/api/v1/instructor/courses/{courseId}/lecture-video/{id}","PUT",null));

            permissions.add(new Permission(null,"sort lecture","COURSE","/api/v1/instructor/courses/{sectionId}/reorder-lectures","POST",null));

            permissions.add(new Permission(null,"update image course","COURSE","/api/v1/instructor/courses/update-image/{id}","PUT",null));
            permissions.add(new Permission(null,"update price course","COURSE","/api/v1/instructor/courses/update-price/{id}","PUT",null));

            permissions.add(new Permission(null,"delete soft course","COURSE","/api/v1/instructor/courses/delete/{id}","POST",null));
            permissions.add(new Permission(null,"activate course","COURSE","/api/v1/instructor/courses/active/{id}","POST",null));
            permissions.add(new Permission(null,"get list category no page","CATEGORY","/api/v1/instructor/courses/categories/no-page","GET",null));

            // ================= USER =================
            // permissions.add(new Permission(null,"get info user","AUTH","/api/v1/me","GET",null));

            // permissions.add(new Permission(null,"add to cart","CART","/api/v1/carts/{courseId}","POST",null));
            // permissions.add(new Permission(null,"get cart","CART","/api/v1/carts","GET",null));
            // permissions.add(new Permission(null,"remove from cart","CART","/api/v1/carts/{courseId}","DELETE",null));
            // permissions.add(new Permission(null,"get sale price","CART","/api/v1/carts/{courseId}/discount/{code}","GET",null));
            // permissions.add(new Permission(null,"check exist course","CART","/api/v1/carts/check-course-in-order","POST",null));

            // permissions.add(new Permission(null,"get list learning","LEARNING","/api/v1/learnings","GET",null));
            // permissions.add(new Permission(null,"use learning","LEARNING","/api/v1/learnings/learn/{courseId}","GET",null));
            // permissions.add(new Permission(null,"mark finish lecture","LEARNING","/api/v1/learnings/lecture/{id}","PUT",null));
            // permissions.add(new Permission(null,"rate course","LEARNING","/api/v1/learnings/rate/{courseId}","POST",null));
            // permissions.add(new Permission(null,"get list quiz","LEARNING","/api/v1/learnings/quiz/{sectionId}","GET",null));

            // permissions.add(new Permission(null,"send notify","NOTIFY","/api/v1/notifications","POST",null));
            // permissions.add(new Permission(null,"get list notify","NOTIFY","/api/v1/notifications","GET",null));
            // permissions.add(new Permission(null,"mark read","NOTIFY","/api/v1/notifications/{id}","POST",null));
            // permissions.add(new Permission(null,"get new","NOTIFY","/api/v1/notifications/get-new","GET",null));
            // permissions.add(new Permission(null,"remove notify","NOTIFY","/api/v1/notifications/{id}","DELETE",null));

            // permissions.add(new Permission(null,"create payment","PAYMENT","/api/v1/payments/vnpay","POST",null));
            // permissions.add(new Permission(null,"save order","PAYMENT","/api/v1/payments","POST",null));

            // permissions.add(new Permission(null,"update profile","PROFILE","/api/v1/profiles/{id}","PUT",null));
            // permissions.add(new Permission(null,"get revenu","PROFILE","/api/v1/profiles/get-pay","GET",null));
            // permissions.add(new Permission(null,"connect bank","PROFILE","/api/v1/profiles/wallet","POST",null));

            // permissions.add(new Permission(null,"connect sse","SSE","/api/v1/sse/subscribe","GET",null));

            permissionRepository.saveAll(permissions);
        }
        permissions = permissionRepository.findAll();
        // List<Permission> userPermissions = permissions.stream()
        // .filter(p ->
        //         p.getPath().startsWith("/api/v1/carts") ||
        //         p.getPath().startsWith("/api/v1/learnings") ||
        //         p.getPath().startsWith("/api/v1/notifications") ||
        //         p.getPath().startsWith("/api/v1/payments") ||
        //         p.getPath().startsWith("/api/v1/profiles") ||
        //         p.getPath().startsWith("/api/v1/me") ||
        //         p.getPath().startsWith("/api/v1/sse")
        // )
        // .toList();
        List<Permission> instructorPermissions = permissions.stream()
            .filter(p -> p.getPath().startsWith("/api/v1/instructor"))
            .toList();

    List<Permission> instructorFullPermissions = new ArrayList<>();
    // instructorFullPermissions.addAll(userPermissions);
    instructorFullPermissions.addAll(instructorPermissions);
        if (countRole == 0) {

            Role roleAdmin = new Role();
            roleAdmin.setName("ADMIN");
            roleAdmin.setPermissions(permissions);

            Role roleUser = new Role();
            roleUser.setName("USER");
            // roleUser.setPermissions(userPermissions);

            Role roleInstructor = new Role();
            roleInstructor.setName("INSTRUCTOR");
            roleInstructor.setPermissions(instructorFullPermissions);

            roles.add(roleAdmin);
            roles.add(roleUser);
            roles.add(roleInstructor);

            roleRepository.saveAll(roles);
        }

        if (countUser == 0) {

            Role adminRole = roleRepository.findByName("ADMIN");

            User user = new User();
            user.setUsername("admin@gmail.com");
            user.setFullname("admin");
            user.setPassword(passwordEncoder.encode("1"));
            user.setRole(adminRole);

            userRepository.save(user);
        }
    }
}
