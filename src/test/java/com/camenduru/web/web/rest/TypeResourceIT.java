package com.camenduru.web.web.rest;

import static com.camenduru.web.domain.TypeAsserts.*;
import static com.camenduru.web.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.camenduru.web.IntegrationTest;
import com.camenduru.web.domain.Type;
import com.camenduru.web.repository.TypeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link TypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TypeResourceIT {

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_AMOUNT = "AAAAAAAAAA";
    private static final String UPDATED_AMOUNT = "BBBBBBBBBB";

    private static final String DEFAULT_SCHEMA = "AAAAAAAAAA";
    private static final String UPDATED_SCHEMA = "BBBBBBBBBB";

    private static final String DEFAULT_MODEL = "AAAAAAAAAA";
    private static final String UPDATED_MODEL = "BBBBBBBBBB";

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_DEFAULT = false;
    private static final Boolean UPDATED_IS_DEFAULT = true;

    private static final Boolean DEFAULT_IS_ACTIVE = false;
    private static final Boolean UPDATED_IS_ACTIVE = true;

    private static final String ENTITY_API_URL = "/api/types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TypeRepository typeRepository;

    @Autowired
    private MockMvc restTypeMockMvc;

    private Type type;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Type createEntity() {
        Type type = new Type()
            .type(DEFAULT_TYPE)
            .amount(DEFAULT_AMOUNT)
            .schema(DEFAULT_SCHEMA)
            .model(DEFAULT_MODEL)
            .title(DEFAULT_TITLE)
            .isDefault(DEFAULT_IS_DEFAULT)
            .isActive(DEFAULT_IS_ACTIVE);
        return type;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Type createUpdatedEntity() {
        Type type = new Type()
            .type(UPDATED_TYPE)
            .amount(UPDATED_AMOUNT)
            .schema(UPDATED_SCHEMA)
            .model(UPDATED_MODEL)
            .title(UPDATED_TITLE)
            .isDefault(UPDATED_IS_DEFAULT)
            .isActive(UPDATED_IS_ACTIVE);
        return type;
    }

    @BeforeEach
    public void initTest() {
        typeRepository.deleteAll();
        type = createEntity();
    }

    @Test
    void createType() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Type
        var returnedType = om.readValue(
            restTypeMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(type)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Type.class
        );

        // Validate the Type in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTypeUpdatableFieldsEquals(returnedType, getPersistedType(returnedType));
    }

    @Test
    void createTypeWithExistingId() throws Exception {
        // Create the Type with an existing ID
        type.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(type)))
            .andExpect(status().isBadRequest());

        // Validate the Type in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkTypeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        type.setType(null);

        // Create the Type, which fails.

        restTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(type)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkAmountIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        type.setAmount(null);

        // Create the Type, which fails.

        restTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(type)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkSchemaIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        type.setSchema(null);

        // Create the Type, which fails.

        restTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(type)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkModelIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        type.setModel(null);

        // Create the Type, which fails.

        restTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(type)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        type.setTitle(null);

        // Create the Type, which fails.

        restTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(type)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkIsDefaultIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        type.setIsDefault(null);

        // Create the Type, which fails.

        restTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(type)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkIsActiveIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        type.setIsActive(null);

        // Create the Type, which fails.

        restTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(type)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllTypes() throws Exception {
        // Initialize the database
        typeRepository.save(type);

        // Get all the typeList
        restTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(type.getId())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.[*].schema").value(hasItem(DEFAULT_SCHEMA)))
            .andExpect(jsonPath("$.[*].model").value(hasItem(DEFAULT_MODEL)))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE.booleanValue())));
    }

    @Test
    void getType() throws Exception {
        // Initialize the database
        typeRepository.save(type);

        // Get the type
        restTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, type.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(type.getId()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT))
            .andExpect(jsonPath("$.schema").value(DEFAULT_SCHEMA))
            .andExpect(jsonPath("$.model").value(DEFAULT_MODEL))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.isDefault").value(DEFAULT_IS_DEFAULT.booleanValue()))
            .andExpect(jsonPath("$.isActive").value(DEFAULT_IS_ACTIVE.booleanValue()));
    }

    @Test
    void getNonExistingType() throws Exception {
        // Get the type
        restTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingType() throws Exception {
        // Initialize the database
        typeRepository.save(type);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the type
        Type updatedType = typeRepository.findById(type.getId()).orElseThrow();
        updatedType
            .type(UPDATED_TYPE)
            .amount(UPDATED_AMOUNT)
            .schema(UPDATED_SCHEMA)
            .model(UPDATED_MODEL)
            .title(UPDATED_TITLE)
            .isDefault(UPDATED_IS_DEFAULT)
            .isActive(UPDATED_IS_ACTIVE);

        restTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedType))
            )
            .andExpect(status().isOk());

        // Validate the Type in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTypeToMatchAllProperties(updatedType);
    }

    @Test
    void putNonExistingType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        type.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeMockMvc
            .perform(put(ENTITY_API_URL_ID, type.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(type)))
            .andExpect(status().isBadRequest());

        // Validate the Type in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        type.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(type))
            )
            .andExpect(status().isBadRequest());

        // Validate the Type in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        type.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(type)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Type in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateTypeWithPatch() throws Exception {
        // Initialize the database
        typeRepository.save(type);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the type using partial update
        Type partialUpdatedType = new Type();
        partialUpdatedType.setId(type.getId());

        partialUpdatedType.amount(UPDATED_AMOUNT).title(UPDATED_TITLE).isActive(UPDATED_IS_ACTIVE);

        restTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedType.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedType))
            )
            .andExpect(status().isOk());

        // Validate the Type in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTypeUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedType, type), getPersistedType(type));
    }

    @Test
    void fullUpdateTypeWithPatch() throws Exception {
        // Initialize the database
        typeRepository.save(type);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the type using partial update
        Type partialUpdatedType = new Type();
        partialUpdatedType.setId(type.getId());

        partialUpdatedType
            .type(UPDATED_TYPE)
            .amount(UPDATED_AMOUNT)
            .schema(UPDATED_SCHEMA)
            .model(UPDATED_MODEL)
            .title(UPDATED_TITLE)
            .isDefault(UPDATED_IS_DEFAULT)
            .isActive(UPDATED_IS_ACTIVE);

        restTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedType.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedType))
            )
            .andExpect(status().isOk());

        // Validate the Type in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTypeUpdatableFieldsEquals(partialUpdatedType, getPersistedType(partialUpdatedType));
    }

    @Test
    void patchNonExistingType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        type.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeMockMvc
            .perform(patch(ENTITY_API_URL_ID, type.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(type)))
            .andExpect(status().isBadRequest());

        // Validate the Type in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        type.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(type))
            )
            .andExpect(status().isBadRequest());

        // Validate the Type in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        type.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(type)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Type in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteType() throws Exception {
        // Initialize the database
        typeRepository.save(type);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the type
        restTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, type.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return typeRepository.count();
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

    protected Type getPersistedType(Type type) {
        return typeRepository.findById(type.getId()).orElseThrow();
    }

    protected void assertPersistedTypeToMatchAllProperties(Type expectedType) {
        assertTypeAllPropertiesEquals(expectedType, getPersistedType(expectedType));
    }

    protected void assertPersistedTypeToMatchUpdatableProperties(Type expectedType) {
        assertTypeAllUpdatablePropertiesEquals(expectedType, getPersistedType(expectedType));
    }
}
