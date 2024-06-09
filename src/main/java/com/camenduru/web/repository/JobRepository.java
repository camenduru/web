package com.camenduru.web.repository;

import com.camenduru.web.domain.Job;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Job entity.
 */
@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    @Query(value = "{'login': ?0, 'status': {$nin: ['EXPIRED', 'FAILED']}}", sort = "{date: -1}")
    Page<Job> findAllByUserIsCurrentUser(Pageable pageable, String login);

    @Query(value = "{status: {$nin: ['EXPIRED', 'FAILED']}}", sort = "{date: -1}")
    Page<Job> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "{}", sort = "{date: -1}")
    List<Job> findAllWithEagerRelationships();

    @Query("{'id': ?0}")
    Optional<Job> findOneWithEagerRelationships(String id);

    @Query(value = "{'login': ?0, 'status': {$ne: 'EXPIRED'}, date: {$gt: ?1}}", sort = "{date: -1}")
    List<Job> findAllByUserNonExpiredJobsNewerThanTheDate(String login, Date date);
}
