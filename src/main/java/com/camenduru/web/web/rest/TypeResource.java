package com.camenduru.web.web.rest;

import com.camenduru.web.domain.Type;
import com.camenduru.web.repository.TypeRepository;
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
 * REST controller for managing {@link com.camenduru.web.domain.Type}.
 */
@RestController
@RequestMapping("/api/types")
public class TypeResource {

    private final Logger log = LoggerFactory.getLogger(TypeResource.class);

    private static final String ENTITY_NAME = "type";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeRepository typeRepository;

    public TypeResource(TypeRepository typeRepository) {
        this.typeRepository = typeRepository;
    }

    /**
     * {@code POST  /types} : Create a new type.
     *
     * @param type the type to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new type, or with status {@code 400 (Bad Request)} if the type has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Type> createType(@Valid @RequestBody Type type) throws URISyntaxException {
        log.debug("REST request to save Type : {}", type);
        if (type.getId() != null) {
            throw new BadRequestAlertException("A new type cannot already have an ID", ENTITY_NAME, "idexists");
        }
        type = typeRepository.save(type);
        return ResponseEntity.created(new URI("/api/types/" + type.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, type.getId()))
            .body(type);
    }

    /**
     * {@code PUT  /types/:id} : Updates an existing type.
     *
     * @param id the id of the type to save.
     * @param type the type to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated type,
     * or with status {@code 400 (Bad Request)} if the type is not valid,
     * or with status {@code 500 (Internal Server Error)} if the type couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Type> updateType(@PathVariable(value = "id", required = false) final String id, @Valid @RequestBody Type type)
        throws URISyntaxException {
        log.debug("REST request to update Type : {}, {}", id, type);
        if (type.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, type.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        type = typeRepository.save(type);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, type.getId())).body(type);
    }

    /**
     * {@code PATCH  /types/:id} : Partial updates given fields of an existing type, field will ignore if it is null
     *
     * @param id the id of the type to save.
     * @param type the type to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated type,
     * or with status {@code 400 (Bad Request)} if the type is not valid,
     * or with status {@code 404 (Not Found)} if the type is not found,
     * or with status {@code 500 (Internal Server Error)} if the type couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Type> partialUpdateType(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Type type
    ) throws URISyntaxException {
        log.debug("REST request to partial update Type partially : {}, {}", id, type);
        if (type.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, type.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Type> result = typeRepository
            .findById(type.getId())
            .map(existingType -> {
                if (type.getType() != null) {
                    existingType.setType(type.getType());
                }
                if (type.getAmount() != null) {
                    existingType.setAmount(type.getAmount());
                }
                if (type.getSchema() != null) {
                    existingType.setSchema(type.getSchema());
                }
                if (type.getModel() != null) {
                    existingType.setModel(type.getModel());
                }
                if (type.getTitle() != null) {
                    existingType.setTitle(type.getTitle());
                }
                if (type.getDescription() != null) {
                    existingType.setDescription(type.getDescription());
                }
                if (type.getImage() != null) {
                    existingType.setImage(type.getImage());
                }
                if (type.getReadme() != null) {
                    existingType.setReadme(type.getReadme());
                }
                if (type.getWeb() != null) {
                    existingType.setWeb(type.getWeb());
                }
                if (type.getPaper() != null) {
                    existingType.setPaper(type.getPaper());
                }
                if (type.getCode() != null) {
                    existingType.setCode(type.getCode());
                }
                if (type.getJupyter() != null) {
                    existingType.setJupyter(type.getJupyter());
                }

                return existingType;
            })
            .map(typeRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, type.getId()));
    }

    /**
     * {@code GET  /types} : get all the types.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of types in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Type>> getAllTypes(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Types");
        Page<Type> page = typeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /types/:id} : get the "id" type.
     *
     * @param id the id of the type to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the type, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Type> getType(@PathVariable("id") String id) {
        log.debug("REST request to get Type : {}", id);
        Optional<Type> type = typeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(type);
    }

    /**
     * {@code DELETE  /types/:id} : delete the "id" type.
     *
     * @param id the id of the type to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteType(@PathVariable("id") String id) {
        log.debug("REST request to delete Type : {}", id);
        typeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
