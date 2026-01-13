package com.jwhisper.udemy.specification;

import org.springframework.data.jpa.domain.Specification;

import com.jwhisper.udemy.model.User;

public class UserSpecification {

    public static Specification<User> isActive(Boolean active) {
        return (root, query, cb) ->
                active == null ? null : cb.equal(root.get("isActive"), active);
    }

    public static Specification<User> keyword(String kw) {
        return (root, query, cb) -> {
            if (kw == null || kw.isBlank()) return null;

            String like = "%" + kw.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("username")), like),
                    cb.like(cb.lower(root.get("fullname")), like)
            );
        };
    }

}
