package com.camenduru.web.domain;

import com.camenduru.web.domain.enumeration.RedeemStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Redeem.
 */
@Document(collection = "redeem")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Redeem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("date")
    private Instant date;

    @NotNull
    @Field("status")
    private RedeemStatus status;

    @NotNull
    @Field("type")
    private String type;

    @NotNull
    @Field("author")
    private String author;

    @NotNull
    @Field("login")
    private String login;

    @NotNull
    @Field("amount")
    private String amount;

    @NotNull
    @Field("code")
    private String code;

    @DBRef
    @Field("user")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Redeem id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public Redeem date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public RedeemStatus getStatus() {
        return this.status;
    }

    public Redeem status(RedeemStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(RedeemStatus status) {
        this.status = status;
    }

    public String getType() {
        return this.type;
    }

    public Redeem type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAuthor() {
        return this.author;
    }

    public Redeem author(String author) {
        this.setAuthor(author);
        return this;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getLogin() {
        return this.login;
    }

    public Redeem login(String login) {
        this.setLogin(login);
        return this;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getAmount() {
        return this.amount;
    }

    public Redeem amount(String amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getCode() {
        return this.code;
    }

    public Redeem code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Redeem user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Redeem)) {
            return false;
        }
        return getId() != null && getId().equals(((Redeem) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Redeem{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", type='" + getType() + "'" +
            ", author='" + getAuthor() + "'" +
            ", login='" + getLogin() + "'" +
            ", amount='" + getAmount() + "'" +
            ", code='" + getCode() + "'" +
            "}";
    }
}
