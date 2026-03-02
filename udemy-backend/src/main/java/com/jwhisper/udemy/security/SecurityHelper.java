package com.jwhisper.udemy.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

import com.jwhisper.udemy.dto.auth.UserToken;
import com.jwhisper.udemy.helper.expception.ErrorException;
import com.jwhisper.udemy.model.User;


@Service
public class SecurityHelper {
    private final JwtEncoder jwtEncoder;
    private final SecretKey secretKey;
 
    public SecurityHelper(JwtEncoder jwtEncoder, SecretKey secretKey
    ) {
        this.jwtEncoder = jwtEncoder;
        this.secretKey = secretKey;
    }

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    @Value("${whisper.jwt.base64-secret}")
    private String jwtKey;

    @Value("${whisper.jwt.access-token-validity-in-seconds}")
    private long accessTokenExpiration;

    @Value("${whisper.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public String generateToken(User user, String type) {
        UserToken userToken = new UserToken();
        userToken.setId(user.getId());
        userToken.setUsername(user.getUsername());
        userToken.setFullname(user.getFullname());
        userToken.setRole(user.getRole().getName());
        long expiration = 0;
        if (type.equals("access_token")) {
            expiration = accessTokenExpiration;
        } else {
            expiration = refreshTokenExpiration;
        }

        Instant now = Instant.now();
        Instant expir = now.plus(expiration, ChronoUnit.SECONDS);
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();

        JwtClaimsSet claimsSet = buildClaimset(expir, now, userToken, type);
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader,
                claimsSet)).getTokenValue();

    }

    private JwtClaimsSet buildClaimset(Instant expir, Instant now, UserToken userToken, String type) {

        if (type.equals("access_token")) {
            return JwtClaimsSet.builder()
                    .issuedAt(now)
                    .expiresAt(expir)
                    .subject(userToken.getUsername())
                    .claim("user", userToken)
                    .claim("permission", userToken.getRole())
                    .build();
        } else {
            return JwtClaimsSet.builder()
                    .issuedAt(now)
                    .expiresAt(expir)
                    .subject(userToken.getUsername())
                    .claim("user", userToken)
                    .build();
        }

    }

    public Jwt checkValidRefreshToken(String token)  {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(
                secretKey).macAlgorithm(SecurityHelper.JWT_ALGORITHM).build();
        try {
            return jwtDecoder.decode(token);
        } catch (Exception e) {
            throw new ErrorException("Refresh token không hợp lệ");
        }
    }

    public String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
    
    public String getCurrentPermission() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getAuthorities().isEmpty()) {
            return null;
        }

        return auth.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);
    }
    // public Course checkCourseUser(String courseId){
    //     String username = this.getCurrentUsername();
    //     var user = this.userRepository.findProjectByUsername(username);
    //     if(user == null) throw new ErrorException("Người dùng này không tồn tại");
    //     Optional<Course> optional = this.courseRepository.findByIdAndAuthorId(courseId, user.getId());
    //     if(optional.isEmpty()) throw new ErrorException("Khoá học này không thuộc về bạn");
    //     return optional.get();
    // }
}
