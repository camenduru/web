package com.camenduru.web.web.rest;

import static com.camenduru.web.domain.DetailAsserts.*;
import static com.camenduru.web.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.camenduru.web.IntegrationTest;
import com.camenduru.web.domain.Detail;
import com.camenduru.web.repository.DetailRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link DetailResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DetailResourceIT {

    private static final String DEFAULT_DISCORD = "AAAAAAAAAA";
    private static final String UPDATED_DISCORD = "BBBBBBBBBB";

    private static final String DEFAULT_TOTAL = "AAAAAAAAAA";
    private static final String UPDATED_TOTAL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DetailRepository detailRepository;

    @Mock
    private DetailRepository detailRepositoryMock;

    @Autowired
    private MockMvc restDetailMockMvc;

    private Detail detail;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Detail createEntity() {
        Detail detail = new Detail().discord(DEFAULT_DISCORD).total(DEFAULT_TOTAL);
        return detail;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Detail createUpdatedEntity() {
        Detail detail = new Detail().discord(UPDATED_DISCORD).total(UPDATED_TOTAL);
        return detail;
    }

    @BeforeEach
    public void initTest() {
        detailRepository.deleteAll();
        detail = createEntity();
    }

    @Test
    void createDetail() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Detail
        var returnedDetail = om.readValue(
            restDetailMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(detail)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Detail.class
        );

        // Validate the Detail in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertDetailUpdatableFieldsEquals(returnedDetail, getPersistedDetail(returnedDetail));
    }

    @Test
    void createDetailWithExistingId() throws Exception {
        // Create the Detail with an existing ID
        detail.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDetailMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(detail)))
            .andExpect(status().isBadRequest());

        // Validate the Detail in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkDiscordIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        detail.setDiscord(null);

        // Create the Detail, which fails.

        restDetailMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(detail)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkTotalIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        detail.setTotal(null);

        // Create the Detail, which fails.

        restDetailMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(detail)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllDetails() throws Exception {
        // Initialize the database
        detailRepository.save(detail);

        // Get all the detailList
        restDetailMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(detail.getId())))
            .andExpect(jsonPath("$.[*].discord").value(hasItem(DEFAULT_DISCORD)))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDetailsWithEagerRelationshipsIsEnabled() throws Exception {
        when(detailRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDetailMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(detailRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDetailsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(detailRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDetailMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(detailRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    void getDetail() throws Exception {
        // Initialize the database
        detailRepository.save(detail);

        // Get the detail
        restDetailMockMvc
            .perform(get(ENTITY_API_URL_ID, detail.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(detail.getId()))
            .andExpect(jsonPath("$.discord").value(DEFAULT_DISCORD))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL));
    }

    @Test
    void getNonExistingDetail() throws Exception {
        // Get the detail
        restDetailMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingDetail() throws Exception {
        // Initialize the database
        detailRepository.save(detail);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the detail
        Detail updatedDetail = detailRepository.findById(detail.getId()).orElseThrow();
        updatedDetail.discord(UPDATED_DISCORD).total(UPDATED_TOTAL);

        restDetailMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDetail.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedDetail))
            )
            .andExpect(status().isOk());

        // Validate the Detail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDetailToMatchAllProperties(updatedDetail);
    }

    @Test
    void putNonExistingDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detail.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDetailMockMvc
            .perform(put(ENTITY_API_URL_ID, detail.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(detail)))
            .andExpect(status().isBadRequest());

        // Validate the Detail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detail.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(detail))
            )
            .andExpect(status().isBadRequest());

        // Validate the Detail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detail.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(detail)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Detail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateDetailWithPatch() throws Exception {
        // Initialize the database
        detailRepository.save(detail);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the detail using partial update
        Detail partialUpdatedDetail = new Detail();
        partialUpdatedDetail.setId(detail.getId());

        partialUpdatedDetail.total(UPDATED_TOTAL);

        restDetailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDetail.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDetail))
            )
            .andExpect(status().isOk());

        // Validate the Detail in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDetailUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedDetail, detail), getPersistedDetail(detail));
    }

    @Test
    void fullUpdateDetailWithPatch() throws Exception {
        // Initialize the database
        detailRepository.save(detail);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the detail using partial update
        Detail partialUpdatedDetail = new Detail();
        partialUpdatedDetail.setId(detail.getId());

        partialUpdatedDetail.discord(UPDATED_DISCORD).total(UPDATED_TOTAL);

        restDetailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDetail.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDetail))
            )
            .andExpect(status().isOk());

        // Validate the Detail in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDetailUpdatableFieldsEquals(partialUpdatedDetail, getPersistedDetail(partialUpdatedDetail));
    }

    @Test
    void patchNonExistingDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detail.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDetailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, detail.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(detail))
            )
            .andExpect(status().isBadRequest());

        // Validate the Detail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detail.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(detail))
            )
            .andExpect(status().isBadRequest());

        // Validate the Detail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamDetail() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detail.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(detail)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Detail in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteDetail() throws Exception {
        // Initialize the database
        detailRepository.save(detail);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the detail
        restDetailMockMvc
            .perform(delete(ENTITY_API_URL_ID, detail.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return detailRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Detail getPersistedDetail(Detail detail) {
        return detailRepository.findById(detail.getId()).orElseThrow();
    }

    protected void assertPersistedDetailToMatchAllProperties(Detail expectedDetail) {
        assertDetailAllPropertiesEquals(expectedDetail, getPersistedDetail(expectedDetail));
    }

    protected void assertPersistedDetailToMatchUpdatableProperties(Detail expectedDetail) {
        assertDetailAllUpdatablePropertiesEquals(expectedDetail, getPersistedDetail(expectedDetail));
    }
}
