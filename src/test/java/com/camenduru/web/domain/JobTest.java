package com.camenduru.web.domain;

import static com.camenduru.web.domain.DetailTestSamples.*;
import static com.camenduru.web.domain.JobTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.camenduru.web.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class JobTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Job.class);
        Job job1 = getJobSample1();
        Job job2 = new Job();
        assertThat(job1).isNotEqualTo(job2);

        job2.setId(job1.getId());
        assertThat(job1).isEqualTo(job2);

        job2 = getJobSample2();
        assertThat(job1).isNotEqualTo(job2);
    }

    @Test
    void discordTest() throws Exception {
        Job job = getJobRandomSampleGenerator();
        Detail detailBack = getDetailRandomSampleGenerator();

        job.setDiscord(detailBack);
        assertThat(job.getDiscord()).isEqualTo(detailBack);

        job.discord(null);
        assertThat(job.getDiscord()).isNull();
    }

    @Test
    void totalTest() throws Exception {
        Job job = getJobRandomSampleGenerator();
        Detail detailBack = getDetailRandomSampleGenerator();

        job.setTotal(detailBack);
        assertThat(job.getTotal()).isEqualTo(detailBack);

        job.total(null);
        assertThat(job.getTotal()).isNull();
    }
}
