package com.camenduru.web.web.rest;

import com.camenduru.web.domain.Credit;
import com.camenduru.web.repository.CreditRepository;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.camenduru.web.domain.Credit}.
 */
@RestController
@RequestMapping("/api/credits")
public class CreditResource {

    private final Logger log = LoggerFactory.getLogger(CreditResource.class);

    private static final String ENTITY_NAME = "credit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CreditRepository creditRepository;

    public CreditResource(CreditRepository creditRepository) {
        this.creditRepository = creditRepository;
    }

    /**
     * {@code POST  /credits} : Create a new credit.
     *
     * @param credit the credit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new credit, or with status {@code 400 (Bad Request)} if the credit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Credit> createCredit(@Valid @RequestBody Credit credit) throws URISyntaxException {
        log.debug("REST request to save Credit : {}", credit);
        if (credit.getId() != null) {
            throw new BadRequestAlertException("A new credit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        credit = creditRepository.save(credit);
        return ResponseEntity.created(new URI("/api/credits/" + credit.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, credit.getId()))
            .body(credit);
    }

    /**
     * {@code PUT  /credits/:id} : Updates an existing credit.
     *
     * @param id the id of the credit to save.
     * @param credit the credit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated credit,
     * or with status {@code 400 (Bad Request)} if the credit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the credit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Credit> updateCredit(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Credit credit
    ) throws URISyntaxException {
        log.debug("REST request to update Credit : {}, {}", id, credit);
        if (credit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, credit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!creditRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        credit = creditRepository.save(credit);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, credit.getId()))
            .body(credit);
    }

    /**
     * {@code PATCH  /credits/:id} : Partial updates given fields of an existing credit, field will ignore if it is null
     *
     * @param id the id of the credit to save.
     * @param credit the credit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated credit,
     * or with status {@code 400 (Bad Request)} if the credit is not valid,
     * or with status {@code 404 (Not Found)} if the credit is not found,
     * or with status {@code 500 (Internal Server Error)} if the credit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Credit> partialUpdateCredit(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Credit credit
    ) throws URISyntaxException {
        log.debug("REST request to partial update Credit partially : {}, {}", id, credit);
        if (credit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, credit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!creditRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Credit> result = creditRepository
            .findById(credit.getId())
            .map(existingCredit -> {
                if (credit.getDate() != null) {
                    existingCredit.setDate(credit.getDate());
                }
                if (credit.getStatus() != null) {
                    existingCredit.setStatus(credit.getStatus());
                }
                if (credit.getSource() != null) {
                    existingCredit.setSource(credit.getSource());
                }
                if (credit.getTotal() != null) {
                    existingCredit.setTotal(credit.getTotal());
                }

                return existingCredit;
            })
            .map(creditRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, credit.getId()));
    }

    /**
     * {@code GET  /credits} : get all the credits.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of credits in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Credit>> getAllCredits(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of Credits");
        Page<Credit> page;
        if (eagerload) {
            page = creditRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = creditRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /credits/:id} : get the "id" credit.
     *
     * @param id the id of the credit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the credit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Credit> getCredit(@PathVariable("id") String id) {
        log.debug("REST request to get Credit : {}", id);
        Optional<Credit> credit = creditRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(credit);
    }

    /**
     * {@code DELETE  /credits/:id} : delete the "id" credit.
     *
     * @param id the id of the credit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredit(@PathVariable("id") String id) {
        log.debug("REST request to delete Credit : {}", id);
        creditRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
