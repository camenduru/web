package com.camenduru.web.service.dto;

public class DeepChatTextRespose {

    private String text;

    public DeepChatTextRespose(String text) {
        if (text != null) {
            this.text = text;
        }
    }

    public String getText() {
        return text;
    }
}
