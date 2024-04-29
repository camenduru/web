package com.camenduru.web.domain;

import java.util.UUID;

public class TypeTestSamples {

    public static Type getTypeSample1() {
        return new Type().id("id1").type("type1").amount("amount1");
    }

    public static Type getTypeSample2() {
        return new Type().id("id2").type("type2").amount("amount2");
    }

    public static Type getTypeRandomSampleGenerator() {
        return new Type().id(UUID.randomUUID().toString()).type(UUID.randomUUID().toString()).amount(UUID.randomUUID().toString());
    }
}
