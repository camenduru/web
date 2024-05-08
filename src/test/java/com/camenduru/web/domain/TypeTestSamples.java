package com.camenduru.web.domain;

import java.util.UUID;

public class TypeTestSamples {

    public static Type getTypeSample1() {
        return new Type().id("id1").type("type1").amount("amount1").schema("schema1").model("model1").title("title1");
    }

    public static Type getTypeSample2() {
        return new Type().id("id2").type("type2").amount("amount2").schema("schema2").model("model2").title("title2");
    }

    public static Type getTypeRandomSampleGenerator() {
        return new Type()
            .id(UUID.randomUUID().toString())
            .type(UUID.randomUUID().toString())
            .amount(UUID.randomUUID().toString())
            .schema(UUID.randomUUID().toString())
            .model(UUID.randomUUID().toString())
            .title(UUID.randomUUID().toString());
    }
}
