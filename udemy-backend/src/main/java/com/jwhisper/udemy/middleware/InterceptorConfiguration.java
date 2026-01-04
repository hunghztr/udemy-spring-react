// package com.jwhisper.udemy.middleware;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// import com.jwhisper.udemy.repository.UserRepository;
// import com.jwhisper.udemy.security.SecurityHelper;

// @Configuration
// public class InterceptorConfiguration implements WebMvcConfigurer {
//   private final String[] whiteList;
//   private final SecurityHelper securityHelper;
//   private final UserRepository userRepository;

//   public InterceptorConfiguration(String[] whiteList, SecurityHelper securityHelper, UserRepository userRepository) {
//     this.whiteList = whiteList;
//     this.securityHelper = securityHelper;
//     this.userRepository = userRepository;
//   }

//   @Bean
//   Interceptor getPermissionInterceptor() {
//     return new Interceptor(securityHelper, userRepository);
//   }

//   @Override
//   public void addInterceptors(InterceptorRegistry registry) {
//     registry.addInterceptor(getPermissionInterceptor())
//         .excludePathPatterns(whiteList);
//   }
// }
