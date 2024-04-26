package com.camenduru.web.domain;

import java.util.UUID;

public class CreditTestSamples {

    public static Credit getCreditSample1() {
        return new Credit().id("id1").amount("amount1").total("total1");
    }

    public static Credit getCreditSample2() {
        return new Credit().id("id2").amount("amount2").total("total2");
    }

    public static Credit getCreditRandomSampleGenerator() {
        return new Credit().id(UUID.randomUUID().toString()).amount(UUID.randomUUID().toString()).total(UUID.randomUUID().toString());
    }
}
