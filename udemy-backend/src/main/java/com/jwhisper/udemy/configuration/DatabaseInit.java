package com.jwhisper.udemy.configuration;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.model.Category;
import com.jwhisper.udemy.model.LearningPath;
import com.jwhisper.udemy.model.LearningPathStep;
import com.jwhisper.udemy.model.Permission;
import com.jwhisper.udemy.model.Role;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.repository.CategoryRepository;
import com.jwhisper.udemy.repository.LearningPathRepository;
import com.jwhisper.udemy.repository.LearningPathStepRepository;
import com.jwhisper.udemy.repository.PermissionRepository;
import com.jwhisper.udemy.repository.RoleRepository;
import com.jwhisper.udemy.repository.UserRepository;

@Service
public class DatabaseInit implements CommandLineRunner {
  private PermissionRepository permissionRepository;
  private RoleRepository roleRepository;
  private UserRepository userRepository;
  private PasswordEncoder passwordEncoder;
  private CategoryRepository categoryRepository;
  private LearningPathRepository learningPathRepository;
  private LearningPathStepRepository learningPathStepRepository;

  public DatabaseInit(
      PermissionRepository permissionRepository,
      RoleRepository roleRepository,
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      CategoryRepository categoryRepository,
      LearningPathRepository learningPathRepository,
      LearningPathStepRepository learningPathStepRepository
  ) {
      this.permissionRepository = permissionRepository;
      this.roleRepository = roleRepository;
      this.userRepository = userRepository;
      this.passwordEncoder = passwordEncoder;
      this.categoryRepository = categoryRepository;
      this.learningPathRepository = learningPathRepository;
      this.learningPathStepRepository = learningPathStepRepository;
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
    // seed category
    if(categoryRepository.count() == 0){

      Category it = new Category();
      it.setName("IT");

      categoryRepository.save(it);

      List<Category> children = new ArrayList<>();

      children.add(createChild("Backend", it));
      children.add(createChild("Frontend", it));
      children.add(createChild("Fullstack", it));
      children.add(createChild("Java", it));
      children.add(createChild(".NET", it));
      children.add(createChild("Python", it));
      children.add(createChild("React", it));

      categoryRepository.saveAll(children);
    }

    // seed learning path
    if(learningPathRepository.count() == 0){

      LearningPath backend = createPath(
          "Backend Developer",
          "Roadmap to become backend developer"
      );

      LearningPath frontend = createPath(
          "Frontend Developer",
          "Roadmap to become frontend developer"
      );

      LearningPath fullstack = createPath(
          "Fullstack Developer",
          "Roadmap to become fullstack developer"
      );

      LearningPath javaDev = createPath(
          "Java Developer",
          "Roadmap to become Java backend developer"
      );

      learningPathRepository.saveAll(
          List.of(backend, frontend, fullstack, javaDev)
      );
    }
    // seed step
    if(learningPathStepRepository.count() == 0){

    Category backend = categoryRepository.findByName("Backend").orElseThrow();
    Category frontend = categoryRepository.findByName("Frontend").orElseThrow();
    Category java = categoryRepository.findByName("Java").orElseThrow();
    Category react = categoryRepository.findByName("React").orElseThrow();

    LearningPath backendPath =
        learningPathRepository.findByName("Backend Developer").orElseThrow();

    LearningPath frontendPath =
        learningPathRepository.findByName("Frontend Developer").orElseThrow();

    LearningPath fullstackPath =
        learningPathRepository.findByName("Fullstack Developer").orElseThrow();

    LearningPath javaPath =
        learningPathRepository.findByName("Java Developer").orElseThrow();

    List<LearningPathStep> steps = new ArrayList<>();

    steps.add(createStep(backendPath,1,backend));
    steps.add(createStep(backendPath,2,java));

    steps.add(createStep(frontendPath,1,frontend));
    steps.add(createStep(frontendPath,2,react));

    steps.add(createStep(fullstackPath,1,frontend));
    steps.add(createStep(fullstackPath,2,backend));

    steps.add(createStep(javaPath,1,java));
    steps.add(createStep(javaPath,2,backend));

    learningPathStepRepository.saveAll(steps);
}
  }
  private Category createChild(String name, Category parent){
    Category c = new Category();
    c.setName(name);
    c.setCategoryParent(parent);
    return c;
  }
  private LearningPath createPath(String name, String desc){
      LearningPath p = new LearningPath();
      p.setName(name);
      p.setDescription(desc);
      return p;
  }
  private LearningPathStep createStep(
      LearningPath path,
      int order,
      Category category
  ){
      LearningPathStep step = new LearningPathStep();
      step.setLearningPath(path);
      step.setStepOrder(order);
      step.setCategory(category);
      return step;
  }
}
