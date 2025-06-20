package com.eren.taxcalculator.repository;

import com.eren.taxcalculator.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // Fetch users who are not admins
    @Query("{ 'roles.name': { $ne: 'ADMIN' } }")
    List<User> findByRolesNotContaining();
}