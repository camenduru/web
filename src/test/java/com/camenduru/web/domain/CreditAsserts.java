package com.camenduru.web.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class CreditAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertCreditAllPropertiesEquals(Credit expected, Credit actual) {
        assertCreditAutoGeneratedPropertiesEquals(expected, actual);
        assertCreditAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertCreditAllUpdatablePropertiesEquals(Credit expected, Credit actual) {
        assertCreditUpdatableFieldsEquals(expected, actual);
        assertCreditUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertCreditAutoGeneratedPropertiesEquals(Credit expected, Credit actual) {
        assertThat(expected)
            .as("Verify Credit auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertCreditUpdatableFieldsEquals(Credit expected, Credit actual) {
        assertThat(expected)
            .as("Verify Credit relevant properties")
            .satisfies(e -> assertThat(e.getDate()).as("check date").isEqualTo(actual.getDate()))
            .satisfies(e -> assertThat(e.getStatus()).as("check status").isEqualTo(actual.getStatus()))
            .satisfies(e -> assertThat(e.getAmount()).as("check amount").isEqualTo(actual.getAmount()))
            .satisfies(e -> assertThat(e.getSource()).as("check source").isEqualTo(actual.getSource()))
            .satisfies(e -> assertThat(e.getTotal()).as("check total").isEqualTo(actual.getTotal()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertCreditUpdatableRelationshipsEquals(Credit expected, Credit actual) {}
}