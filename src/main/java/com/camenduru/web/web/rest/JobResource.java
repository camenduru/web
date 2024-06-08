package com.camenduru.web.web.rest;

import com.camenduru.web.domain.Authority;
import com.camenduru.web.domain.Detail;
import com.camenduru.web.domain.Job;
import com.camenduru.web.domain.Type;
import com.camenduru.web.domain.User;
import com.camenduru.web.domain.enumeration.JobSource;
import com.camenduru.web.domain.enumeration.JobStatus;
import com.camenduru.web.repository.DetailRepository;
import com.camenduru.web.repository.JobRepository;
import com.camenduru.web.repository.TypeRepository;
import com.camenduru.web.repository.UserRepository;
import com.camenduru.web.security.AuthoritiesConstants;
import com.camenduru.web.security.SecurityUtils;
import com.camenduru.web.web.rest.errors.BadRequestAlertException;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.imageio.ImageIO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.camenduru.web.domain.Job}.
 */
@RestController
@RequestMapping("/api/jobs")
public class JobResource {

    private final Logger log = LoggerFactory.getLogger(JobResource.class);

    private static final String ENTITY_NAME = "job";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Value("${camenduru.web.default.result}")
    private String camenduruWebResult;

    @Value("${camenduru.web.default.result.suffix}")
    private String camenduruWebResultSuffix;

    @Value("${camenduru.web.cooldown}")
    private String camenduruWebCooldown;

    @Value("${camenduru.web.default.free.total}")
    private String camenduruWebFreeTotal;

    @Value("${camenduru.web.default.paid.total}")
    private String camenduruWebPaidTotal;

    private final JobRepository jobRepository;
    private final DetailRepository detailRepository;
    private final UserRepository userRepository;
    private final TypeRepository typeRepository;
    private final SimpMessageSendingOperations simpMessageSendingOperations;

    public JobResource(
        JobRepository jobRepository,
        DetailRepository detailRepository,
        UserRepository userRepository,
        TypeRepository typeRepository,
        SimpMessageSendingOperations simpMessageSendingOperations
    ) {
        this.jobRepository = jobRepository;
        this.detailRepository = detailRepository;
        this.userRepository = userRepository;
        this.typeRepository = typeRepository;
        this.simpMessageSendingOperations = simpMessageSendingOperations;
    }

    /**
     * {@code POST  /jobs} : Create a new job.
     *
     * @param job the job to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new job, or with status {@code 400 (Bad Request)} if the job has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Job> createJob(@Valid @RequestBody Job job) throws URISyntaxException {
        Detail detail = detailRepository.findAllByUserIsCurrentUser(SecurityUtils.getCurrentUserLogin().orElseThrow()).orElseThrow();
        int total = Integer.parseInt(detail.getTotal());
        Type typeC = typeRepository.findByType(job.getType()).orElseThrow();
        int amount = Integer.parseInt(typeC.getAmount());
        String destination = String.format("/notify/%s", detail.getLogin());
        int cooldown = Integer.parseInt(camenduruWebCooldown);
        Date date = new Date(System.currentTimeMillis() - (cooldown * 1000));

        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            log.debug("REST request to save Job : {}", job);
            if (job.getId() != null) {
                throw new BadRequestAlertException("A new job cannot already have an ID", ENTITY_NAME, "idexists");
            }
            job = jobRepository.save(job);
            return ResponseEntity.created(new URI("/api/jobs/" + job.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, job.getId()))
                .body(job);
        } else if (total >= amount) {
            if (
                jobRepository.findAllByUserNonExpiredJobsNewerThanTheDate(SecurityUtils.getCurrentUserLogin().orElseThrow(), date).size() >
                0
            ) {
                String result = String.format("Oops! Cooldown is %s seconds.", cooldown);
                String payload = String.format("%s", result);
                simpMessageSendingOperations.convertAndSend(destination, payload);
                // throw new BadRequestAlertException("User in cooldown state.", ENTITY_NAME, "Cooldown State");
                return ResponseEntity.ok().body(null);
            } else {
                log.debug("REST request to save Job : {}", job);
                if (job.getId() != null) {
                    throw new BadRequestAlertException("A new job cannot already have an ID", ENTITY_NAME, "idexists");
                }
                User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElseThrow()).orElseThrow();
                if (
                    (!user.getAuthorities().contains(new Authority().name("ROLE_PAID")) && typeC.getIsFree()) ||
                    user.getAuthorities().contains(new Authority().name("ROLE_PAID"))
                ) {
                    int width = 512;
                    int height = 512;
                    String jsonString = job.getCommand();
                    try {
                        JsonElement jsonElement = JsonParser.parseString(jsonString);
                        if (jsonElement.isJsonObject()) {
                            JsonObject jsonObject = jsonElement.getAsJsonObject();
                            if (jsonObject.has("width") && jsonObject.has("height")) {
                                width = jsonObject.get("width").getAsInt();
                                height = jsonObject.get("height").getAsInt();
                            } else {
                                if (jsonObject.has("input_image_check")) {
                                    String input_image = jsonObject.get("input_image_check").getAsString();
                                    URL image_url;
                                    BufferedImage image;
                                    try {
                                        image_url = new URL(input_image);
                                        image = ImageIO.read(image_url);
                                        width = image.getWidth();
                                        height = image.getHeight();
                                    } catch (IOException e) {
                                        e.printStackTrace();
                                    }
                                }
                            }
                        }
                    } catch (JsonSyntaxException e) {
                        System.err.println("Invalid JSON syntax: " + e.getMessage());
                    }
                    job.setResult(camenduruWebResult + width + "x" + height + camenduruWebResultSuffix);
                    job.setType(typeC.getType());
                    job.setAmount(typeC.getAmount());
                    job.setSourceChannel(detail.getSourceChannel());
                    job.setSourceId(detail.getSourceId());
                    job.setDate(Instant.now());
                    job.setStatus(JobStatus.WAITING);
                    job.setLogin(SecurityUtils.getCurrentUserLogin().orElseThrow());
                    job.setSource(JobSource.WEB);
                    job.setDiscord(detail);
                    job.setTotal(detail);
                    job.setUser(user);
                    job = jobRepository.save(job);
                    return ResponseEntity.created(new URI("/api/jobs/" + job.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, job.getId()))
                        .body(job);
                } else {
                    throw new BadRequestAlertException("User authority and job authority mismatch.", ENTITY_NAME, "Invalid Authority");
                }
            }
        } else {
            String result = String.format(
                """
                    Oops! Your balance is insufficient. If you want a daily wallet balance of
                    <span class='text-info' style='font-weight: bold;'>%s</span>, please subscribe to
                    <a class='text-info' style='font-weight: bold;' href='https://github.com/sponsors/camenduru'>GitHub Sponsors</a> or
                    <a class='text-info' style='font-weight: bold;' href='https://www.patreon.com/camenduru'>Patreon</a>,
                    or wait for the daily free <span class='text-info' style='font-weight: bold;'>%s</span> Tost wallet balance.
                """,
                camenduruWebPaidTotal,
                camenduruWebFreeTotal
            );
            String payload = String.format("%s", result);
            simpMessageSendingOperations.convertAndSend(destination, payload);
            // throw new BadRequestAlertException("User balance is insufficient.", ENTITY_NAME, "Insufficient Balance");
            return ResponseEntity.ok().body(null);
        }
    }

    /**
     * {@code PUT  /jobs/:id} : Updates an existing job.
     *
     * @param id the id of the job to save.
     * @param job the job to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated job,
     * or with status {@code 400 (Bad Request)} if the job is not valid,
     * or with status {@code 500 (Internal Server Error)} if the job couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Job> updateJob(@PathVariable(value = "id", required = false) final String id, @Valid @RequestBody Job job)
        throws URISyntaxException {
        log.debug("REST request to update Job : {}, {}", id, job);
        if (job.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, job.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        job = jobRepository.save(job);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, job.getId())).body(job);
    }

    /**
     * {@code PATCH  /jobs/:id} : Partial updates given fields of an existing job, field will ignore if it is null
     *
     * @param id the id of the job to save.
     * @param job the job to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated job,
     * or with status {@code 400 (Bad Request)} if the job is not valid,
     * or with status {@code 404 (Not Found)} if the job is not found,
     * or with status {@code 500 (Internal Server Error)} if the job couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Job> partialUpdateJob(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Job job
    ) throws URISyntaxException {
        log.debug("REST request to partial update Job partially : {}, {}", id, job);
        if (job.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, job.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Job> result = jobRepository
            .findById(job.getId())
            .map(existingJob -> {
                if (job.getDate() != null) {
                    existingJob.setDate(job.getDate());
                }
                if (job.getStatus() != null) {
                    existingJob.setStatus(job.getStatus());
                }
                if (job.getSource() != null) {
                    existingJob.setSource(job.getSource());
                }
                if (job.getSourceId() != null) {
                    existingJob.setSourceId(job.getSourceId());
                }
                if (job.getSourceChannel() != null) {
                    existingJob.setSourceChannel(job.getSourceChannel());
                }
                if (job.getCommand() != null) {
                    existingJob.setCommand(job.getCommand());
                }
                if (job.getType() != null) {
                    existingJob.setType(job.getType());
                }
                if (job.getAmount() != null) {
                    existingJob.setAmount(job.getAmount());
                }
                if (job.getResult() != null) {
                    existingJob.setResult(job.getResult());
                }
                if (job.getLogin() != null) {
                    existingJob.setLogin(job.getLogin());
                }

                return existingJob;
            })
            .map(jobRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, job.getId()));
    }

    /**
     * {@code GET  /jobs} : get all the jobs.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jobs in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Job>> getAllJobs(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of Jobs");
        Page<Job> page;
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            if (eagerload) {
                page = jobRepository.findAllWithEagerRelationships(pageable);
            } else {
                page = jobRepository.findAll(pageable);
            }
        } else {
            page = jobRepository.findAllByUserIsCurrentUser(pageable, SecurityUtils.getCurrentUserLogin().orElseThrow());
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /jobs/:id} : get the "id" job.
     *
     * @param id the id of the job to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the job, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Job> getJob(@PathVariable("id") String id) {
        log.debug("REST request to get Job : {}", id);
        Optional<Job> job = jobRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(job);
    }

    /**
     * {@code DELETE  /jobs/:id} : delete the "id" job.
     *
     * @param id the id of the job to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable("id") String id) {
        log.debug("REST request to delete Job : {}", id);
        jobRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
