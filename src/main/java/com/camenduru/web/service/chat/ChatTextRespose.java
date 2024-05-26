package com.camenduru.web.service.chat;

public class ChatTextRespose {

    private String text;

    public ChatTextRespose(String text) {
        if (text != null) {
            this.text = text;
        }
    }

    public String getText() {
        return text;
    }
}
