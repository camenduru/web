package com.camenduru.web.domain;

import java.util.UUID;

public class DetailTestSamples {

    public static Detail getDetailSample1() {
        return new Detail().id("id1").discord("discord1").total("total1");
    }

    public static Detail getDetailSample2() {
        return new Detail().id("id2").discord("discord2").total("total2");
    }

    public static Detail getDetailRandomSampleGenerator() {
        return new Detail().id(UUID.randomUUID().toString()).discord(UUID.randomUUID().toString()).total(UUID.randomUUID().toString());
    }
}
