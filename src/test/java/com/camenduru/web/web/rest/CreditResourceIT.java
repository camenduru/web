package com.camenduru.web.web.rest;

import static com.camenduru.web.domain.CreditAsserts.*;
import static com.camenduru.web.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.camenduru.web.IntegrationTest;
import com.camenduru.web.domain.Credit;
import com.camenduru.web.domain.enumeration.CreditSource;
import com.camenduru.web.domain.enumeration.CreditStatus;
import com.camenduru.web.repository.CreditRepository;
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
 * Integration tests for the {@link CreditResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CreditResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final CreditStatus DEFAULT_STATUS = CreditStatus.POSITIVE;
    private static final CreditStatus UPDATED_STATUS = CreditStatus.NEGATIVE;

    private static final String DEFAULT_AMOUNT = "AAAAAAAAAA";
    private static final String UPDATED_AMOUNT = "BBBBBBBBBB";

    private static final CreditSource DEFAULT_SOURCE = CreditSource.WEB;
    private static final CreditSource UPDATED_SOURCE = CreditSource.IOS;

    private static final String DEFAULT_TOTAL = "AAAAAAAAAA";
    private static final String UPDATED_TOTAL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/credits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CreditRepository creditRepository;

    @Mock
    private CreditRepository creditRepositoryMock;

    @Autowired
    private MockMvc restCreditMockMvc;

    private Credit credit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Credit createEntity() {
        Credit credit = new Credit()
            .date(DEFAULT_DATE)
            .status(DEFAULT_STATUS)
            .amount(DEFAULT_AMOUNT)
            .source(DEFAULT_SOURCE)
            .total(DEFAULT_TOTAL);
        return credit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Credit createUpdatedEntity() {
        Credit credit = new Credit()
            .date(UPDATED_DATE)
            .status(UPDATED_STATUS)
            .amount(UPDATED_AMOUNT)
            .source(UPDATED_SOURCE)
            .total(UPDATED_TOTAL);
        return credit;
    }

    @BeforeEach
    public void initTest() {
        creditRepository.deleteAll();
        credit = createEntity();
    }

    @Test
    void createCredit() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Credit
        var returnedCredit = om.readValue(
            restCreditMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(credit)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Credit.class
        );

        // Validate the Credit in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCreditUpdatableFieldsEquals(returnedCredit, getPersistedCredit(returnedCredit));
    }

    @Test
    void createCreditWithExistingId() throws Exception {
        // Create the Credit with an existing ID
        credit.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCreditMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(credit)))
            .andExpect(status().isBadRequest());

        // Validate the Credit in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        credit.setDate(null);

        // Create the Credit, which fails.

        restCreditMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(credit)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        credit.setStatus(null);

        // Create the Credit, which fails.

        restCreditMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(credit)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkAmountIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        credit.setAmount(null);

        // Create the Credit, which fails.

        restCreditMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(credit)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkSourceIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        credit.setSource(null);

        // Create the Credit, which fails.

        restCreditMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(credit)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkTotalIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        credit.setTotal(null);

        // Create the Credit, which fails.

        restCreditMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(credit)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllCredits() throws Exception {
        // Initialize the database
        creditRepository.save(credit);

        // Get all the creditList
        restCreditMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(credit.getId())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.[*].source").value(hasItem(DEFAULT_SOURCE.toString())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCreditsWithEagerRelationshipsIsEnabled() throws Exception {
        when(creditRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCreditMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(creditRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCreditsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(creditRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCreditMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(creditRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    void getCredit() throws Exception {
        // Initialize the database
        creditRepository.save(credit);

        // Get the credit
        restCreditMockMvc
            .perform(get(ENTITY_API_URL_ID, credit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(credit.getId()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT))
            .andExpect(jsonPath("$.source").value(DEFAULT_SOURCE.toString()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL));
    }

    @Test
    void getNonExistingCredit() throws Exception {
        // Get the credit
        restCreditMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingCredit() throws Exception {
        // Initialize the database
        creditRepository.save(credit);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the credit
        Credit updatedCredit = creditRepository.findById(credit.getId()).orElseThrow();
        updatedCredit.date(UPDATED_DATE).status(UPDATED_STATUS).amount(UPDATED_AMOUNT).source(UPDATED_SOURCE).total(UPDATED_TOTAL);

        restCreditMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCredit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCredit))
            )
            .andExpect(status().isOk());

        // Validate the Credit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCreditToMatchAllProperties(updatedCredit);
    }

    @Test
    void putNonExistingCredit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        credit.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(put(ENTITY_API_URL_ID, credit.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(credit)))
            .andExpect(status().isBadRequest());

        // Validate the Credit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchCredit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        credit.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(credit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Credit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamCredit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        credit.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(credit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Credit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateCreditWithPatch() throws Exception {
        // Initialize the database
        creditRepository.save(credit);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the credit using partial update
        Credit partialUpdatedCredit = new Credit();
        partialUpdatedCredit.setId(credit.getId());

        partialUpdatedCredit.status(UPDATED_STATUS).amount(UPDATED_AMOUNT).total(UPDATED_TOTAL);

        restCreditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCredit.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCredit))
            )
            .andExpect(status().isOk());

        // Validate the Credit in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCreditUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedCredit, credit), getPersistedCredit(credit));
    }

    @Test
    void fullUpdateCreditWithPatch() throws Exception {
        // Initialize the database
        creditRepository.save(credit);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the credit using partial update
        Credit partialUpdatedCredit = new Credit();
        partialUpdatedCredit.setId(credit.getId());

        partialUpdatedCredit.date(UPDATED_DATE).status(UPDATED_STATUS).amount(UPDATED_AMOUNT).source(UPDATED_SOURCE).total(UPDATED_TOTAL);

        restCreditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCredit.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCredit))
            )
            .andExpect(status().isOk());

        // Validate the Credit in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCreditUpdatableFieldsEquals(partialUpdatedCredit, getPersistedCredit(partialUpdatedCredit));
    }

    @Test
    void patchNonExistingCredit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        credit.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, credit.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(credit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Credit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchCredit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        credit.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(credit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Credit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamCredit() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        credit.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(credit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Credit in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteCredit() throws Exception {
        // Initialize the database
        creditRepository.save(credit);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the credit
        restCreditMockMvc
            .perform(delete(ENTITY_API_URL_ID, credit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return creditRepository.count();
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

    protected Credit getPersistedCredit(Credit credit) {
        return creditRepository.findById(credit.getId()).orElseThrow();
    }

    protected void assertPersistedCreditToMatchAllProperties(Credit expectedCredit) {
        assertCreditAllPropertiesEquals(expectedCredit, getPersistedCredit(expectedCredit));
    }

    protected void assertPersistedCreditToMatchUpdatableProperties(Credit expectedCredit) {
        assertCreditAllUpdatablePropertiesEquals(expectedCredit, getPersistedCredit(expectedCredit));
    }
}
