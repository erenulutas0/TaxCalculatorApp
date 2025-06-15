package com.eren.taxcalculator.repository;

import com.eren.taxcalculator.model.Role;
import com.eren.taxcalculator.model.RoleName;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(RoleName name);
}