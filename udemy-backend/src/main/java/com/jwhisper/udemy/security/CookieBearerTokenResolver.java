package com.jwhisper.udemy.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.util.StringUtils;

public class CookieBearerTokenResolver implements BearerTokenResolver {

    private static final String ACCESS_TOKEN_COOKIE = "access_token";

    @Override
    public String resolve(HttpServletRequest request) {
        // uu tiên Authorization header
        String authHeader = request.getHeader("Authorization");
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        //  fallback sang cookie
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (ACCESS_TOKEN_COOKIE.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}
