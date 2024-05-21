package com.camenduru.web.web.rest;

import static com.camenduru.web.domain.RedeemAsserts.*;
import static com.camenduru.web.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.camenduru.web.IntegrationTest;
import com.camenduru.web.domain.Redeem;
import com.camenduru.web.domain.enumeration.RedeemStatus;
import com.camenduru.web.repository.RedeemRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link RedeemResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RedeemResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final RedeemStatus DEFAULT_STATUS = RedeemStatus.WAITING;
    private static final RedeemStatus UPDATED_STATUS = RedeemStatus.USED;

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_LOGIN = "AAAAAAAAAA";
    private static final String UPDATED_LOGIN = "BBBBBBBBBB";

    private static final String DEFAULT_AMOUNT = "AAAAAAAAAA";
    private static final String UPDATED_AMOUNT = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/redeems";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private RedeemRepository redeemRepository;

    @Mock
    private RedeemRepository redeemRepositoryMock;

    @Autowired
    private MockMvc restRedeemMockMvc;

    private Redeem redeem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Redeem createEntity() {
        Redeem redeem = new Redeem()
            .date(DEFAULT_DATE)
            .status(DEFAULT_STATUS)
            .type(DEFAULT_TYPE)
            .author(DEFAULT_AUTHOR)
            .login(DEFAULT_LOGIN)
            .amount(DEFAULT_AMOUNT)
            .code(DEFAULT_CODE);
        return redeem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Redeem createUpdatedEntity() {
        Redeem redeem = new Redeem()
            .date(UPDATED_DATE)
            .status(UPDATED_STATUS)
            .type(UPDATED_TYPE)
            .author(UPDATED_AUTHOR)
            .login(UPDATED_LOGIN)
            .amount(UPDATED_AMOUNT)
            .code(UPDATED_CODE);
        return redeem;
    }

    @BeforeEach
    public void initTest() {
        redeemRepository.deleteAll();
        redeem = createEntity();
    }

    @Test
    void createRedeem() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Redeem
        var returnedRedeem = om.readValue(
            restRedeemMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(redeem)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Redeem.class
        );

        // Validate the Redeem in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertRedeemUpdatableFieldsEquals(returnedRedeem, getPersistedRedeem(returnedRedeem));
    }

    @Test
    void createRedeemWithExistingId() throws Exception {
        // Create the Redeem with an existing ID
        redeem.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRedeemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(redeem)))
            .andExpect(status().isBadRequest());

        // Validate the Redeem in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        redeem.setDate(null);

        // Create the Redeem, which fails.

        restRedeemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(redeem)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        redeem.setStatus(null);

        // Create the Redeem, which fails.

        restRedeemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(redeem)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkTypeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        redeem.setType(null);

        // Create the Redeem, which fails.

        restRedeemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(redeem)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkAuthorIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        redeem.setAuthor(null);

        // Create the Redeem, which fails.

        restRedeemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(redeem)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkLoginIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        redeem.setLogin(null);

        // Create the Redeem, which fails.

        restRedeemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(redeem)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkAmountIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        redeem.setAmount(null);

        // Create the Redeem, which fails.

        restRedeemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(redeem)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkCodeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        redeem.setCode(null);

        // Create the Redeem, which fails.

        restRedeemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(redeem)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllRedeems() throws Exception {
        // Initialize the database
        redeemRepository.save(redeem);

        // Get all the redeemList
        restRedeemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(redeem.getId())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR)))
            .andExpect(jsonPath("$.[*].login").value(hasItem(DEFAULT_LOGIN)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRedeemsWithEagerRelationshipsIsEnabled() throws Exception {
        when(redeemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRedeemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(redeemRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRedeemsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(redeemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRedeemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(redeemRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    void getRedeem() throws Exception {
        // Initialize the database
        redeemRepository.save(redeem);

        // Get the redeem
        restRedeemMockMvc
            .perform(get(ENTITY_API_URL_ID, redeem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(redeem.getId()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR))
            .andExpect(jsonPath("$.login").value(DEFAULT_LOGIN))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE));
    }

    @Test
    void getNonExistingRedeem() throws Exception {
        // Get the redeem
        restRedeemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingRedeem() throws Exception {
        // Initialize the database
        redeemRepository.save(redeem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the redeem
        Redeem updatedRedeem = redeemRepository.findById(redeem.getId()).orElseThrow();
        updatedRedeem
            .date(UPDATED_DATE)
            .status(UPDATED_STATUS)
            .type(UPDATED_TYPE)
            .author(UPDATED_AUTHOR)
            .login(UPDATED_LOGIN)
            .amount(UPDATED_AMOUNT)
            .code(UPDATED_CODE);

        restRedeemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRedeem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedRedeem))
            )
            .andExpect(status().isOk());

        // Validate the Redeem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedRedeemToMatchAllProperties(updatedRedeem);
    }

    @Test
    void putNonExistingRedeem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        redeem.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRedeemMockMvc
            .perform(put(ENTITY_API_URL_ID, redeem.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(redeem)))
            .andExpect(status().isBadRequest());

        // Validate the Redeem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchRedeem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        redeem.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRedeemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(redeem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Redeem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamRedeem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        redeem.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRedeemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(redeem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Redeem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateRedeemWithPatch() throws Exception {
        // Initialize the database
        redeemRepository.save(redeem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the redeem using partial update
        Redeem partialUpdatedRedeem = new Redeem();
        partialUpdatedRedeem.setId(redeem.getId());

        partialUpdatedRedeem.status(UPDATED_STATUS).type(UPDATED_TYPE).author(UPDATED_AUTHOR).code(UPDATED_CODE);

        restRedeemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRedeem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRedeem))
            )
            .andExpect(status().isOk());

        // Validate the Redeem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRedeemUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedRedeem, redeem), getPersistedRedeem(redeem));
    }

    @Test
    void fullUpdateRedeemWithPatch() throws Exception {
        // Initialize the database
        redeemRepository.save(redeem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the redeem using partial update
        Redeem partialUpdatedRedeem = new Redeem();
        partialUpdatedRedeem.setId(redeem.getId());

        partialUpdatedRedeem
            .date(UPDATED_DATE)
            .status(UPDATED_STATUS)
            .type(UPDATED_TYPE)
            .author(UPDATED_AUTHOR)
            .login(UPDATED_LOGIN)
            .amount(UPDATED_AMOUNT)
            .code(UPDATED_CODE);

        restRedeemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRedeem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRedeem))
            )
            .andExpect(status().isOk());

        // Validate the Redeem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRedeemUpdatableFieldsEquals(partialUpdatedRedeem, getPersistedRedeem(partialUpdatedRedeem));
    }

    @Test
    void patchNonExistingRedeem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        redeem.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRedeemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, redeem.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(redeem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Redeem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchRedeem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        redeem.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRedeemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(redeem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Redeem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamRedeem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        redeem.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRedeemMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(redeem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Redeem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteRedeem() throws Exception {
        // Initialize the database
        redeemRepository.save(redeem);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the redeem
        restRedeemMockMvc
            .perform(delete(ENTITY_API_URL_ID, redeem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return redeemRepository.count();
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

    protected Redeem getPersistedRedeem(Redeem redeem) {
        return redeemRepository.findById(redeem.getId()).orElseThrow();
    }

    protected void assertPersistedRedeemToMatchAllProperties(Redeem expectedRedeem) {
        assertRedeemAllPropertiesEquals(expectedRedeem, getPersistedRedeem(expectedRedeem));
    }

    protected void assertPersistedRedeemToMatchUpdatableProperties(Redeem expectedRedeem) {
        assertRedeemAllUpdatablePropertiesEquals(expectedRedeem, getPersistedRedeem(expectedRedeem));
    }
}
