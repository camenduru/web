package com.camenduru.web.domain;

import com.camenduru.web.domain.enumeration.Membership;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Detail.
 */
@Document(collection = "detail")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Detail implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("discord")
    private String discord;

    @NotNull
    @Field("source_id")
    private String sourceId;

    @NotNull
    @Field("source_channel")
    private String sourceChannel;

    @NotNull
    @Field("total")
    private String total;

    @NotNull
    @Field("login")
    private String login;

    @NotNull
    @Field("membership")
    private Membership membership;

    @DBRef
    @Field("user")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Detail id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDiscord() {
        return this.discord;
    }

    public Detail discord(String discord) {
        this.setDiscord(discord);
        return this;
    }

    public void setDiscord(String discord) {
        this.discord = discord;
    }

    public String getSourceId() {
        return this.sourceId;
    }

    public Detail sourceId(String sourceId) {
        this.setSourceId(sourceId);
        return this;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public String getSourceChannel() {
        return this.sourceChannel;
    }

    public Detail sourceChannel(String sourceChannel) {
        this.setSourceChannel(sourceChannel);
        return this;
    }

    public void setSourceChannel(String sourceChannel) {
        this.sourceChannel = sourceChannel;
    }

    public String getTotal() {
        return this.total;
    }

    public Detail total(String total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    public String getLogin() {
        return this.login;
    }

    public Detail login(String login) {
        this.setLogin(login);
        return this;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public Membership getMembership() {
        return this.membership;
    }

    public Detail membership(Membership membership) {
        this.setMembership(membership);
        return this;
    }

    public void setMembership(Membership membership) {
        this.membership = membership;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Detail user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Detail)) {
            return false;
        }
        return getId() != null && getId().equals(((Detail) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Detail{" +
            "id=" + getId() +
            ", discord='" + getDiscord() + "'" +
            ", sourceId='" + getSourceId() + "'" +
            ", sourceChannel='" + getSourceChannel() + "'" +
            ", total='" + getTotal() + "'" +
            ", login='" + getLogin() + "'" +
            ", membership='" + getMembership() + "'" +
            "}";
    }
}
