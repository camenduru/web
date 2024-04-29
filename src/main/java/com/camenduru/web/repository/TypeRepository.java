package com.camenduru.web.repository;

import com.camenduru.web.domain.Type;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Type entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeRepository extends MongoRepository<Type, String> {}
