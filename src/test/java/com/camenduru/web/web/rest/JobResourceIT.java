package com.camenduru.web.web.rest;

import static com.camenduru.web.domain.JobAsserts.*;
import static com.camenduru.web.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.camenduru.web.IntegrationTest;
import com.camenduru.web.domain.Job;
import com.camenduru.web.domain.enumeration.JobSource;
import com.camenduru.web.domain.enumeration.JobStatus;
import com.camenduru.web.repository.JobRepository;
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
 * Integration tests for the {@link JobResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class JobResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final JobStatus DEFAULT_STATUS = JobStatus.POSITIVE;
    private static final JobStatus UPDATED_STATUS = JobStatus.NEGATIVE;

    private static final JobSource DEFAULT_SOURCE = JobSource.WEB;
    private static final JobSource UPDATED_SOURCE = JobSource.IOS;

    private static final String DEFAULT_SOURCE_ID = "AAAAAAAAAA";
    private static final String UPDATED_SOURCE_ID = "BBBBBBBBBB";

    private static final String DEFAULT_SOURCE_CHANNEL = "AAAAAAAAAA";
    private static final String UPDATED_SOURCE_CHANNEL = "BBBBBBBBBB";

    private static final String DEFAULT_COMMAND = "AAAAAAAAAA";
    private static final String UPDATED_COMMAND = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_AMOUNT = "AAAAAAAAAA";
    private static final String UPDATED_AMOUNT = "BBBBBBBBBB";

    private static final String DEFAULT_RESULT = "AAAAAAAAAA";
    private static final String UPDATED_RESULT = "BBBBBBBBBB";

    private static final String DEFAULT_LOGIN = "AAAAAAAAAA";
    private static final String UPDATED_LOGIN = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/jobs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private JobRepository jobRepository;

    @Mock
    private JobRepository jobRepositoryMock;

    @Autowired
    private MockMvc restJobMockMvc;

    private Job job;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Job createEntity() {
        Job job = new Job()
            .date(DEFAULT_DATE)
            .status(DEFAULT_STATUS)
            .source(DEFAULT_SOURCE)
            .sourceId(DEFAULT_SOURCE_ID)
            .sourceChannel(DEFAULT_SOURCE_CHANNEL)
            .command(DEFAULT_COMMAND)
            .type(DEFAULT_TYPE)
            .amount(DEFAULT_AMOUNT)
            .result(DEFAULT_RESULT)
            .login(DEFAULT_LOGIN);
        return job;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Job createUpdatedEntity() {
        Job job = new Job()
            .date(UPDATED_DATE)
            .status(UPDATED_STATUS)
            .source(UPDATED_SOURCE)
            .sourceId(UPDATED_SOURCE_ID)
            .sourceChannel(UPDATED_SOURCE_CHANNEL)
            .command(UPDATED_COMMAND)
            .type(UPDATED_TYPE)
            .amount(UPDATED_AMOUNT)
            .result(UPDATED_RESULT)
            .login(UPDATED_LOGIN);
        return job;
    }

    @BeforeEach
    public void initTest() {
        jobRepository.deleteAll();
        job = createEntity();
    }

    @Test
    void createJob() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Job
        var returnedJob = om.readValue(
            restJobMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Job.class
        );

        // Validate the Job in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertJobUpdatableFieldsEquals(returnedJob, getPersistedJob(returnedJob));
    }

    @Test
    void createJobWithExistingId() throws Exception {
        // Create the Job with an existing ID
        job.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJobMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        // Validate the Job in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        job.setDate(null);

        // Create the Job, which fails.

        restJobMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        job.setStatus(null);

        // Create the Job, which fails.

        restJobMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkSourceIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        job.setSource(null);

        // Create the Job, which fails.

        restJobMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkSourceIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        job.setSourceId(null);

        // Create the Job, which fails.

        restJobMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkSourceChannelIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        job.setSourceChannel(null);

        // Create the Job, which fails.

        restJobMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkCommandIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        job.setCommand(null);

        // Create the Job, which fails.

        restJobMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkTypeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        job.setType(null);

        // Create the Job, which fails.

        restJobMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkAmountIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        job.setAmount(null);

        // Create the Job, which fails.

        restJobMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkResultIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        job.setResult(null);

        // Create the Job, which fails.

        restJobMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkLoginIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        job.setLogin(null);

        // Create the Job, which fails.

        restJobMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllJobs() throws Exception {
        // Initialize the database
        jobRepository.save(job);

        // Get all the jobList
        restJobMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(job.getId())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].source").value(hasItem(DEFAULT_SOURCE.toString())))
            .andExpect(jsonPath("$.[*].sourceId").value(hasItem(DEFAULT_SOURCE_ID)))
            .andExpect(jsonPath("$.[*].sourceChannel").value(hasItem(DEFAULT_SOURCE_CHANNEL)))
            .andExpect(jsonPath("$.[*].command").value(hasItem(DEFAULT_COMMAND)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.[*].result").value(hasItem(DEFAULT_RESULT)))
            .andExpect(jsonPath("$.[*].login").value(hasItem(DEFAULT_LOGIN)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllJobsWithEagerRelationshipsIsEnabled() throws Exception {
        when(jobRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restJobMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(jobRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllJobsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(jobRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restJobMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(jobRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    void getJob() throws Exception {
        // Initialize the database
        jobRepository.save(job);

        // Get the job
        restJobMockMvc
            .perform(get(ENTITY_API_URL_ID, job.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(job.getId()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.source").value(DEFAULT_SOURCE.toString()))
            .andExpect(jsonPath("$.sourceId").value(DEFAULT_SOURCE_ID))
            .andExpect(jsonPath("$.sourceChannel").value(DEFAULT_SOURCE_CHANNEL))
            .andExpect(jsonPath("$.command").value(DEFAULT_COMMAND))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT))
            .andExpect(jsonPath("$.result").value(DEFAULT_RESULT))
            .andExpect(jsonPath("$.login").value(DEFAULT_LOGIN));
    }

    @Test
    void getNonExistingJob() throws Exception {
        // Get the job
        restJobMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingJob() throws Exception {
        // Initialize the database
        jobRepository.save(job);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the job
        Job updatedJob = jobRepository.findById(job.getId()).orElseThrow();
        updatedJob
            .date(UPDATED_DATE)
            .status(UPDATED_STATUS)
            .source(UPDATED_SOURCE)
            .sourceId(UPDATED_SOURCE_ID)
            .sourceChannel(UPDATED_SOURCE_CHANNEL)
            .command(UPDATED_COMMAND)
            .type(UPDATED_TYPE)
            .amount(UPDATED_AMOUNT)
            .result(UPDATED_RESULT)
            .login(UPDATED_LOGIN);

        restJobMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJob.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(updatedJob))
            )
            .andExpect(status().isOk());

        // Validate the Job in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedJobToMatchAllProperties(updatedJob);
    }

    @Test
    void putNonExistingJob() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        job.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobMockMvc
            .perform(put(ENTITY_API_URL_ID, job.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        // Validate the Job in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchJob() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        job.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(job))
            )
            .andExpect(status().isBadRequest());

        // Validate the Job in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamJob() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        job.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(job)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Job in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateJobWithPatch() throws Exception {
        // Initialize the database
        jobRepository.save(job);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the job using partial update
        Job partialUpdatedJob = new Job();
        partialUpdatedJob.setId(job.getId());

        partialUpdatedJob.source(UPDATED_SOURCE).sourceId(UPDATED_SOURCE_ID).command(UPDATED_COMMAND).type(UPDATED_TYPE);

        restJobMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJob.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedJob))
            )
            .andExpect(status().isOk());

        // Validate the Job in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertJobUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedJob, job), getPersistedJob(job));
    }

    @Test
    void fullUpdateJobWithPatch() throws Exception {
        // Initialize the database
        jobRepository.save(job);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the job using partial update
        Job partialUpdatedJob = new Job();
        partialUpdatedJob.setId(job.getId());

        partialUpdatedJob
            .date(UPDATED_DATE)
            .status(UPDATED_STATUS)
            .source(UPDATED_SOURCE)
            .sourceId(UPDATED_SOURCE_ID)
            .sourceChannel(UPDATED_SOURCE_CHANNEL)
            .command(UPDATED_COMMAND)
            .type(UPDATED_TYPE)
            .amount(UPDATED_AMOUNT)
            .result(UPDATED_RESULT)
            .login(UPDATED_LOGIN);

        restJobMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJob.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedJob))
            )
            .andExpect(status().isOk());

        // Validate the Job in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertJobUpdatableFieldsEquals(partialUpdatedJob, getPersistedJob(partialUpdatedJob));
    }

    @Test
    void patchNonExistingJob() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        job.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobMockMvc
            .perform(patch(ENTITY_API_URL_ID, job.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(job)))
            .andExpect(status().isBadRequest());

        // Validate the Job in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchJob() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        job.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(job))
            )
            .andExpect(status().isBadRequest());

        // Validate the Job in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamJob() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        job.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(job)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Job in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteJob() throws Exception {
        // Initialize the database
        jobRepository.save(job);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the job
        restJobMockMvc.perform(delete(ENTITY_API_URL_ID, job.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return jobRepository.count();
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

    protected Job getPersistedJob(Job job) {
        return jobRepository.findById(job.getId()).orElseThrow();
    }

    protected void assertPersistedJobToMatchAllProperties(Job expectedJob) {
        assertJobAllPropertiesEquals(expectedJob, getPersistedJob(expectedJob));
    }

    protected void assertPersistedJobToMatchUpdatableProperties(Job expectedJob) {
        assertJobAllUpdatablePropertiesEquals(expectedJob, getPersistedJob(expectedJob));
    }
}
