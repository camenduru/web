package com.camenduru.web.domain;

import static com.camenduru.web.domain.CreditTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.camenduru.web.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CreditTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Credit.class);
        Credit credit1 = getCreditSample1();
        Credit credit2 = new Credit();
        assertThat(credit1).isNotEqualTo(credit2);

        credit2.setId(credit1.getId());
        assertThat(credit1).isEqualTo(credit2);

        credit2 = getCreditSample2();
        assertThat(credit1).isNotEqualTo(credit2);
    }
}
