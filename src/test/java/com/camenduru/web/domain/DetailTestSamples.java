package com.camenduru.web.domain;

import java.util.UUID;

public class DetailTestSamples {

    public static Detail getDetailSample1() {
        return new Detail()
            .id("id1")
            .discord("discord1")
            .sourceId("sourceId1")
            .sourceChannel("sourceChannel1")
            .total("total1")
            .login("login1");
    }

    public static Detail getDetailSample2() {
        return new Detail()
            .id("id2")
            .discord("discord2")
            .sourceId("sourceId2")
            .sourceChannel("sourceChannel2")
            .total("total2")
            .login("login2");
    }

    public static Detail getDetailRandomSampleGenerator() {
        return new Detail()
            .id(UUID.randomUUID().toString())
            .discord(UUID.randomUUID().toString())
            .sourceId(UUID.randomUUID().toString())
            .sourceChannel(UUID.randomUUID().toString())
            .total(UUID.randomUUID().toString())
            .login(UUID.randomUUID().toString());
    }
}
