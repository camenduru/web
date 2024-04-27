package com.camenduru.web.web.rest;

import com.camenduru.web.domain.Detail;
import com.camenduru.web.domain.User;
import com.camenduru.web.repository.DetailRepository;
import com.camenduru.web.repository.UserRepository;
import com.camenduru.web.security.SecurityUtils;
import com.camenduru.web.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.camenduru.web.domain.Detail}.
 */
@RestController
@RequestMapping("/api/details")
public class DetailResource {

    private final Logger log = LoggerFactory.getLogger(DetailResource.class);

    private static final String ENTITY_NAME = "detail";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DetailRepository detailRepository;

    private final UserRepository userRepository;

    public DetailResource(DetailRepository detailRepository, UserRepository userRepository) {
        this.detailRepository = detailRepository;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /details} : Create a new detail.
     *
     * @param detail the detail to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new detail, or with status {@code 400 (Bad Request)} if the detail has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Detail> createDetail(@Valid @RequestBody Detail detail) throws URISyntaxException {
        log.debug("REST request to save Detail : {}", detail);
        if (detail.getId() != null) {
            throw new BadRequestAlertException("A new detail cannot already have an ID", ENTITY_NAME, "idexists");
        }
        detail = detailRepository.save(detail);
        return ResponseEntity.created(new URI("/api/details/" + detail.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, detail.getId()))
            .body(detail);
    }

    /**
     * {@code PUT  /details/:id} : Updates an existing detail.
     *
     * @param id the id of the detail to save.
     * @param detail the detail to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated detail,
     * or with status {@code 400 (Bad Request)} if the detail is not valid,
     * or with status {@code 500 (Internal Server Error)} if the detail couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Detail> updateDetail(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Detail detail
    ) throws URISyntaxException {
        log.debug("REST request to update Detail : {}, {}", id, detail);
        if (detail.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, detail.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!detailRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        detail = detailRepository.save(detail);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, detail.getId()))
            .body(detail);
    }

    /**
     * {@code PATCH  /details/:id} : Partial updates given fields of an existing detail, field will ignore if it is null
     *
     * @param id the id of the detail to save.
     * @param detail the detail to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated detail,
     * or with status {@code 400 (Bad Request)} if the detail is not valid,
     * or with status {@code 404 (Not Found)} if the detail is not found,
     * or with status {@code 500 (Internal Server Error)} if the detail couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Detail> partialUpdateDetail(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Detail detail
    ) throws URISyntaxException {
        log.debug("REST request to partial update Detail partially : {}, {}", id, detail);
        if (detail.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, detail.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!detailRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Detail> result = detailRepository
            .findById(detail.getId())
            .map(existingDetail -> {
                if (detail.getDiscord() != null) {
                    existingDetail.setDiscord(detail.getDiscord());
                }
                if (detail.getTotal() != null) {
                    existingDetail.setTotal(detail.getTotal());
                }

                return existingDetail;
            })
            .map(detailRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, detail.getId()));
    }

    /**
     * {@code GET  /details} : get all the details.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of details in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Detail>> getAllDetails(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of Details");
        Page<Detail> page;
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElseThrow()).orElseThrow();
        if (user.getAuthorities().stream().anyMatch(authority -> authority.getName().equals("ROLE_ADMIN"))) {
            if (eagerload) {
                page = detailRepository.findAllWithEagerRelationships(pageable);
            } else {
                page = detailRepository.findAll(pageable);
            }
        } else {
            page = detailRepository.findAllByUserIsCurrentUser(pageable, user.getId());
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /details/:id} : get the "id" detail.
     *
     * @param id the id of the detail to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the detail, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Detail> getDetail(@PathVariable("id") String id) {
        log.debug("REST request to get Detail : {}", id);
        Optional<Detail> detail = detailRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(detail);
    }

    /**
     * {@code DELETE  /details/:id} : delete the "id" detail.
     *
     * @param id the id of the detail to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteDetail(@PathVariable("id") String id) {
        log.debug("REST request to delete Detail : {}", id);
        detailRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
