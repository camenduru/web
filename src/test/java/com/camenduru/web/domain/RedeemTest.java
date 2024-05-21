package com.camenduru.web.domain;

import static com.camenduru.web.domain.RedeemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.camenduru.web.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RedeemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Redeem.class);
        Redeem redeem1 = getRedeemSample1();
        Redeem redeem2 = new Redeem();
        assertThat(redeem1).isNotEqualTo(redeem2);

        redeem2.setId(redeem1.getId());
        assertThat(redeem1).isEqualTo(redeem2);

        redeem2 = getRedeemSample2();
        assertThat(redeem1).isNotEqualTo(redeem2);
    }
}
