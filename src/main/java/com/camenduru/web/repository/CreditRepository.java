package com.camenduru.web.repository;

import com.camenduru.web.domain.Credit;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Credit entity.
 */
@Repository
public interface CreditRepository extends MongoRepository<Credit, String> {
    @Query("{}")
    Page<Credit> findAllWithEagerRelationships(Pageable pageable);

    @Query("{}")
    List<Credit> findAllWithEagerRelationships();

    @Query("{'id': ?0}")
    Optional<Credit> findOneWithEagerRelationships(String id);
}
