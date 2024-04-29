package com.camenduru.web.repository;

import com.camenduru.web.domain.Detail;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Detail entity.
 */
@Repository
public interface DetailRepository extends MongoRepository<Detail, String> {
    @Query("{'login': ?0}")
    Page<Detail> findAllByUserIsCurrentUser(Pageable pageable, String login);

    @Query("{'login': ?0}")
    Optional<Detail> findAllByUserIsCurrentUser(String login);

    @Query("{}")
    Page<Detail> findAllWithEagerRelationships(Pageable pageable);

    @Query("{}")
    List<Detail> findAllWithEagerRelationships();

    @Query("{'id': ?0}")
    Optional<Detail> findOneWithEagerRelationships(String id);
}
