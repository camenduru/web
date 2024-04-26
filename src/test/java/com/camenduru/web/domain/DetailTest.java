package com.camenduru.web.domain;

import static com.camenduru.web.domain.DetailTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.camenduru.web.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DetailTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Detail.class);
        Detail detail1 = getDetailSample1();
        Detail detail2 = new Detail();
        assertThat(detail1).isNotEqualTo(detail2);

        detail2.setId(detail1.getId());
        assertThat(detail1).isEqualTo(detail2);

        detail2 = getDetailSample2();
        assertThat(detail1).isNotEqualTo(detail2);
    }
}
