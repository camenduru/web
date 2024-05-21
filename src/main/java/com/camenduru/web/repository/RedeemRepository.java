package com.camenduru.web.repository;

import com.camenduru.web.domain.Redeem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Redeem entity.
 */
@Repository
public interface RedeemRepository extends MongoRepository<Redeem, String> {
    @Query("{}")
    Page<Redeem> findAllWithEagerRelationships(Pageable pageable);

    @Query("{}")
    List<Redeem> findAllWithEagerRelationships();

    @Query("{'id': ?0}")
    Optional<Redeem> findOneWithEagerRelationships(String id);

    @Query("{'code': ?0}")
    Redeem findOneWithCode(String code);
}
