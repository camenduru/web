package com.camenduru.web.service;

public class EmailServiceNotAllowedException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public EmailServiceNotAllowedException() {
        super("Email service is not allowed!");
    }
}
