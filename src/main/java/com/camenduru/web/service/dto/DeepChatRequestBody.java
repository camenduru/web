package com.camenduru.web.service.dto;

public class DeepChatRequestBody {

    private DeepChatRequestMessageDTO[] messages;
    private String model;
    private Boolean stream;

    public DeepChatRequestMessageDTO[] getMessages() {
        return this.messages;
    }

    public String getModel() {
        return this.model;
    }

    public Boolean getStream() {
        return this.stream;
    }
}
