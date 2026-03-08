package com.jwhisper.udemy.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jwhisper.udemy.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart,String> {
    Optional<Cart> findByUserId(String userId);
}
