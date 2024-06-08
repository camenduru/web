package com.camenduru.web.web.rest.errors;

@SuppressWarnings("java:S110") // Inheritance tree of classes should not be too deep
public class EmailServiceNotAllowedException extends BadRequestAlertException {

    private static final long serialVersionUID = 1L;

    public EmailServiceNotAllowedException() {
        super(ErrorConstants.EMAIL_SERVICE_NOT_ALLOWED_TYPE, "Email service is not allowed!", "userManagement", "emailservicenotallowed");
    }
}
