package com.camenduru.web.domain;

import java.util.UUID;

public class JobTestSamples {

    public static Job getJobSample1() {
        return new Job()
            .id("id1")
            .sourceId("sourceId1")
            .sourceChannel("sourceChannel1")
            .sourceUsername("sourceUsername1")
            .command("command1")
            .type("type1")
            .amount("amount1")
            .total("total1")
            .result("result1");
    }

    public static Job getJobSample2() {
        return new Job()
            .id("id2")
            .sourceId("sourceId2")
            .sourceChannel("sourceChannel2")
            .sourceUsername("sourceUsername2")
            .command("command2")
            .type("type2")
            .amount("amount2")
            .total("total2")
            .result("result2");
    }

    public static Job getJobRandomSampleGenerator() {
        return new Job()
            .id(UUID.randomUUID().toString())
            .sourceId(UUID.randomUUID().toString())
            .sourceChannel(UUID.randomUUID().toString())
            .sourceUsername(UUID.randomUUID().toString())
            .command(UUID.randomUUID().toString())
            .type(UUID.randomUUID().toString())
            .amount(UUID.randomUUID().toString())
            .total(UUID.randomUUID().toString())
            .result(UUID.randomUUID().toString());
    }
}
