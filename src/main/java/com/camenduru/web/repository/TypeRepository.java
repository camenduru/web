package com.camenduru.web.repository;

import com.camenduru.web.domain.Type;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Type entity.
 */
@Repository
public interface TypeRepository extends MongoRepository<Type, String> {
    @Query("{'type': ?0}")
    Optional<Type> findByType(String type);
}
