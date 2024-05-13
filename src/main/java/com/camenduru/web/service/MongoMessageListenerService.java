package com.camenduru.web.service;

import com.camenduru.web.domain.Job;
import com.camenduru.web.web.websocket.ActivityService;
import com.mongodb.client.model.changestream.ChangeStreamDocument;
import org.bson.Document;
import org.springframework.data.mongodb.core.messaging.Message;
import org.springframework.data.mongodb.core.messaging.MessageListener;
import org.springframework.stereotype.Component;

@Component
public class MongoMessageListenerService implements MessageListener<ChangeStreamDocument<Document>, Job> {

    private final ActivityService activityService;

    public MongoMessageListenerService(ActivityService activityService) {
        this.activityService = activityService;
    }

    @Override
    public void onMessage(Message<ChangeStreamDocument<Document>, Job> message) {
        activityService.sendLogMessage(message);
    }
}
