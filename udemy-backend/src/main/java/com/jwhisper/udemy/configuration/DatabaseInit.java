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
public class DatabaseInit implements CommandLineRunner {
  private PermissionRepository permissionRepository;
  private RoleRepository roleRepository;
  private UserRepository userRepository;
  private PasswordEncoder passwordEncoder;

  public DatabaseInit(PermissionRepository permissionRepository, RoleRepository roleRepository,
      UserRepository userRepository, PasswordEncoder passwordEncoder) {
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
    List<Permission> userPermissions = new ArrayList<>();

    List<Role> roles = new ArrayList<>();
    if (countPermission == 0) {
      permissions.add(new Permission(null, "Hello with user", "HELLO", "/hello-user", "GET", null));
      permissions.add(new Permission(null, "Hello with admin", "HELLO", "/hello-admin", "GET", null));
      userPermissions.add(new Permission(null, "Hello with user", "HELLO", "/hello-user", "GET", null));
      permissionRepository.saveAll(permissions);
      permissionRepository.saveAll(userPermissions);
    }
    if (countRole == 0) {
      Role roleAdmin = new Role();
      roleAdmin.setName("ADMIN");
      roleAdmin.setPermissions(permissions);
      Role roleUser = new Role();
      roleUser.setName("USER");
      roleUser.setPermissions(userPermissions);
      Role roleInstructor = new Role();
      roleInstructor.setName("INSTRUCTOR");
      roleInstructor.setPermissions(userPermissions);
      roles.add(roleAdmin);
      roles.add(roleUser);
      roles.add(roleInstructor);
      roleRepository.saveAll(roles);
    }
    if (countUser == 0) {
      User user = new User();
      user.setUsername("admin@gmail.com");
      user.setFullname("admin");
      user.setPassword(passwordEncoder.encode("1"));
      user.setRole(roles.get(0));
      userRepository.save(user);
    }
  }
}
