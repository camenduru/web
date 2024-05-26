package com.camenduru.web.service.chat;

public class ChatRequestBody {

    private ChatRequestMessage[] messages;
    private String model;
    private Boolean stream;

    public ChatRequestMessage[] getMessages() {
        return this.messages;
    }

    public String getModel() {
        return this.model;
    }

    public Boolean getStream() {
        return this.stream;
    }
}
