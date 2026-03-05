package com.jwhisper.udemy.configuration;

import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.jwhisper.udemy.helper.constant.LoginMethod;
import com.jwhisper.udemy.helper.expception.CustomAuthenticationEntryPoint;
import com.jwhisper.udemy.model.Role;
import com.jwhisper.udemy.model.User;
import com.jwhisper.udemy.redis.AuthRedisService;
import com.jwhisper.udemy.repository.RoleRepository;
import com.jwhisper.udemy.repository.UserRepository;
import com.jwhisper.udemy.security.CheckBlackListToken;
import com.jwhisper.udemy.security.CookieBearerTokenResolver;
import com.jwhisper.udemy.security.CustomOAuth2Success;
import com.jwhisper.udemy.security.SecurityHelper;
import com.jwhisper.udemy.service.AuthService;
import com.nimbusds.jose.jwk.source.ImmutableSecret;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

  @Value("${whisper.jwt.base64-secret}")
  private String jwtKey;

  private final AuthRedisService redisService;
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final AuthService authService;

  public SecurityConfiguration(AuthRedisService redisService,
      UserRepository userRepository, RoleRepository roleRepository,
      @Lazy AuthService authService) {
    this.redisService = redisService;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.authService = authService;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public String[] getWhiteList() {
    return new String[] { "/oauth2/**", "/swagger-ui/**", "/v3/api-docs/**", "/api/v1/auth/**","/api/v1/files/**",
    "/api/v1/client/**" ,
    "/api/v1/hello" };
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http,
      CustomAuthenticationEntryPoint point)
      throws Exception {

    http
        .csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults())

        .exceptionHandling(ex -> ex.authenticationEntryPoint(point))

        .authorizeHttpRequests(auth -> auth
            .requestMatchers(getWhiteList()).permitAll()
            .anyRequest().authenticated())

        .oauth2Login(oauth -> oauth
            .userInfoEndpoint(userInfo -> userInfo
                .userService(customOAuth2UserService()))
            .successHandler(oAuth2SuccessHandler()))

        .oauth2ResourceServer(oauth2 -> oauth2
          .bearerTokenResolver(new CookieBearerTokenResolver())
            .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            .authenticationEntryPoint(point))

        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

        .formLogin(AbstractHttpConfigurer::disable)
        .logout(AbstractHttpConfigurer::disable);

    return http.build();
  }

  @Bean
  public SecretKey getSecretKey() {
    byte[] keyBytes = com.nimbusds.jose.util.Base64.from(jwtKey).decode();
    return new SecretKeySpec(keyBytes, 0, keyBytes.length, SecurityHelper.JWT_ALGORITHM.getName());
  }

  @Bean
  public JwtEncoder jwtEncoder(SecretKey secretKey) {
    return new NimbusJwtEncoder(new ImmutableSecret<>(secretKey));
  }

  @Bean
  public JwtDecoder jwtDecoder(SecretKey secretKey) {
    NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(secretKey)
        .macAlgorithm(SecurityHelper.JWT_ALGORITHM)
        .build();
    return new CheckBlackListToken(jwtDecoder, redisService);
  }

  @Bean
  public JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
    grantedAuthoritiesConverter.setAuthorityPrefix("");
    grantedAuthoritiesConverter.setAuthoritiesClaimName("permission");

    JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
    return jwtAuthenticationConverter;
  }

  // config OAuth2 login with Provider
  @Bean
  public OAuth2UserService<OAuth2UserRequest, OAuth2User> customOAuth2UserService() {
    DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    return request -> {
      OAuth2User oauthUser = delegate.loadUser(request);

      String email = oauthUser.getAttribute("email");

      User user = this.userRepository.findByUsername(email).orElse(null);

      if (user == null) {
        user = new User();
        user.setAvatarPath(oauthUser.getAttribute("picture"));
        user.setFullname(oauthUser.getAttribute("name"));
        user.setUsername(email);
        user.setMethod(LoginMethod.GOOGLE);

        Role role = this.roleRepository.findByName("USER");
        user.setRole(role);

        user = this.userRepository.save(user);
      }

      // Gán thêm userId vào attributes
      Map<String, Object> attributes = new HashMap<>(oauthUser.getAttributes());
      attributes.put("userId", user.getId());

      return new DefaultOAuth2User(
          oauthUser.getAuthorities(),
          attributes,
          "email");
    };
  }

  @Bean
  public AuthenticationSuccessHandler oAuth2SuccessHandler() {
    return new CustomOAuth2Success(authService);
  }
}
