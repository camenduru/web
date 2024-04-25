package com.camenduru.web.config;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.test.context.ContextConfigurationAttributes;
import org.springframework.test.context.ContextCustomizer;
import org.springframework.test.context.ContextCustomizerFactory;
import org.springframework.test.context.MergedContextConfiguration;

public class TestContainersSpringContextCustomizerFactory implements ContextCustomizerFactory {

    private Logger log = LoggerFactory.getLogger(TestContainersSpringContextCustomizerFactory.class);

    private static MongoDbTestContainer mongoDbBean;

    @Override
    public ContextCustomizer createContextCustomizer(Class<?> testClass, List<ContextConfigurationAttributes> configAttributes) {
        return new ContextCustomizer() {
            @Override
            public void customizeContext(ConfigurableApplicationContext context, MergedContextConfiguration mergedConfig) {
                ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
                TestPropertyValues testValues = TestPropertyValues.empty();
                EmbeddedMongo mongoAnnotation = AnnotatedElementUtils.findMergedAnnotation(testClass, EmbeddedMongo.class);
                if (null != mongoAnnotation) {
                    log.debug("detected the EmbeddedMongo annotation on class {}", testClass.getName());
                    log.info("Warming up the mongo database");
                    if (null == mongoDbBean) {
                        mongoDbBean = beanFactory.createBean(MongoDbTestContainer.class);
                        beanFactory.registerSingleton(MongoDbTestContainer.class.getName(), mongoDbBean);
                        // ((DefaultListableBeanFactory)beanFactory).registerDisposableBean(MongoDbTestContainer.class.getName(), mongoDbBean);
                    }
                    testValues = testValues.and("spring.data.mongodb.uri=" + mongoDbBean.getMongoDBContainer().getReplicaSetUrl());
                }
                testValues.applyTo(context);
            }

            @Override
            public int hashCode() {
                return MongoDbTestContainer.class.getName().hashCode();
            }

            @Override
            public boolean equals(Object obj) {
                return this.hashCode() == obj.hashCode();
            }
        };
    }
}
