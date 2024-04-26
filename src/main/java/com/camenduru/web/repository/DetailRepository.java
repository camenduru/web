package com.camenduru.web.repository;

import com.camenduru.web.domain.Detail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Detail entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DetailRepository extends MongoRepository<Detail, String> {}
