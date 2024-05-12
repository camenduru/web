package com.camenduru.web.service;

import com.camenduru.web.domain.Job;
import com.camenduru.web.domain.enumeration.JobStatus;
import com.mongodb.client.model.changestream.ChangeStreamDocument;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.messaging.Message;
import org.springframework.data.mongodb.core.messaging.MessageListener;

public class MongoMessageListenerService implements MessageListener<ChangeStreamDocument<Document>, Job> {

    private final Logger log = LoggerFactory.getLogger(MongoMessageListenerService.class);

    @Override
    public void onMessage(Message<ChangeStreamDocument<Document>, Job> message) {
        JobStatus status = message.getBody().getStatus();
        if (status == JobStatus.DONE) {
            log.info("{} : {}", status, message.getBody().getId());
        }
    }
}
