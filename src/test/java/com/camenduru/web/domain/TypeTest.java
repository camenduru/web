package com.camenduru.web.domain;

import static com.camenduru.web.domain.TypeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.camenduru.web.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Type.class);
        Type type1 = getTypeSample1();
        Type type2 = new Type();
        assertThat(type1).isNotEqualTo(type2);

        type2.setId(type1.getId());
        assertThat(type1).isEqualTo(type2);

        type2 = getTypeSample2();
        assertThat(type1).isNotEqualTo(type2);
    }
}
