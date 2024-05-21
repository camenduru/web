package com.camenduru.web.web.rest;

import com.camenduru.web.domain.Redeem;
import com.camenduru.web.repository.RedeemRepository;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.camenduru.web.domain.Redeem}.
 */
@RestController
@RequestMapping("/api/redeems")
public class RedeemResource {

    private final Logger log = LoggerFactory.getLogger(RedeemResource.class);

    private static final String ENTITY_NAME = "redeem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RedeemRepository redeemRepository;

    public RedeemResource(RedeemRepository redeemRepository) {
        this.redeemRepository = redeemRepository;
    }

    /**
     * {@code POST  /redeems} : Create a new redeem.
     *
     * @param redeem the redeem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new redeem, or with status {@code 400 (Bad Request)} if the redeem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Redeem> createRedeem(@Valid @RequestBody Redeem redeem) throws URISyntaxException {
        log.debug("REST request to save Redeem : {}", redeem);
        if (redeem.getId() != null) {
            throw new BadRequestAlertException("A new redeem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        redeem = redeemRepository.save(redeem);
        return ResponseEntity.created(new URI("/api/redeems/" + redeem.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, redeem.getId()))
            .body(redeem);
    }

    /**
     * {@code PUT  /redeems/:id} : Updates an existing redeem.
     *
     * @param id the id of the redeem to save.
     * @param redeem the redeem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated redeem,
     * or with status {@code 400 (Bad Request)} if the redeem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the redeem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Redeem> updateRedeem(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Redeem redeem
    ) throws URISyntaxException {
        log.debug("REST request to update Redeem : {}, {}", id, redeem);
        if (redeem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, redeem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!redeemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        redeem = redeemRepository.save(redeem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, redeem.getId()))
            .body(redeem);
    }

    /**
     * {@code PATCH  /redeems/:id} : Partial updates given fields of an existing redeem, field will ignore if it is null
     *
     * @param id the id of the redeem to save.
     * @param redeem the redeem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated redeem,
     * or with status {@code 400 (Bad Request)} if the redeem is not valid,
     * or with status {@code 404 (Not Found)} if the redeem is not found,
     * or with status {@code 500 (Internal Server Error)} if the redeem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Redeem> partialUpdateRedeem(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Redeem redeem
    ) throws URISyntaxException {
        log.debug("REST request to partial update Redeem partially : {}, {}", id, redeem);
        if (redeem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, redeem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!redeemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Redeem> result = redeemRepository
            .findById(redeem.getId())
            .map(existingRedeem -> {
                if (redeem.getDate() != null) {
                    existingRedeem.setDate(redeem.getDate());
                }
                if (redeem.getStatus() != null) {
                    existingRedeem.setStatus(redeem.getStatus());
                }
                if (redeem.getType() != null) {
                    existingRedeem.setType(redeem.getType());
                }
                if (redeem.getAuthor() != null) {
                    existingRedeem.setAuthor(redeem.getAuthor());
                }
                if (redeem.getLogin() != null) {
                    existingRedeem.setLogin(redeem.getLogin());
                }
                if (redeem.getAmount() != null) {
                    existingRedeem.setAmount(redeem.getAmount());
                }
                if (redeem.getCode() != null) {
                    existingRedeem.setCode(redeem.getCode());
                }

                return existingRedeem;
            })
            .map(redeemRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, redeem.getId()));
    }

    /**
     * {@code GET  /redeems} : get all the redeems.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of redeems in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public List<Redeem> getAllRedeems(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        log.debug("REST request to get all Redeems");
        if (eagerload) {
            return redeemRepository.findAllWithEagerRelationships();
        } else {
            return redeemRepository.findAll();
        }
    }

    /**
     * {@code GET  /redeems/:id} : get the "id" redeem.
     *
     * @param id the id of the redeem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the redeem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Redeem> getRedeem(@PathVariable("id") String id) {
        log.debug("REST request to get Redeem : {}", id);
        Optional<Redeem> redeem = redeemRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(redeem);
    }

    /**
     * {@code DELETE  /redeems/:id} : delete the "id" redeem.
     *
     * @param id the id of the redeem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteRedeem(@PathVariable("id") String id) {
        log.debug("REST request to delete Redeem : {}", id);
        redeemRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
