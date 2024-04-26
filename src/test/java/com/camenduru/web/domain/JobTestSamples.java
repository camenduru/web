package com.camenduru.web.domain;

import java.util.UUID;

public class JobTestSamples {

    public static Job getJobSample1() {
        return new Job()
            .id("id1")
            .sourceID("sourceID1")
            .sourceChannel("sourceChannel1")
            .sourceUsername("sourceUsername1")
            .command("command1")
            .server("server1");
    }

    public static Job getJobSample2() {
        return new Job()
            .id("id2")
            .sourceID("sourceID2")
            .sourceChannel("sourceChannel2")
            .sourceUsername("sourceUsername2")
            .command("command2")
            .server("server2");
    }

    public static Job getJobRandomSampleGenerator() {
        return new Job()
            .id(UUID.randomUUID().toString())
            .sourceID(UUID.randomUUID().toString())
            .sourceChannel(UUID.randomUUID().toString())
            .sourceUsername(UUID.randomUUID().toString())
            .command(UUID.randomUUID().toString())
            .server(UUID.randomUUID().toString());
    }
}
