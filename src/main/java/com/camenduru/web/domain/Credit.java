package com.camenduru.web.domain;

import com.camenduru.web.domain.enumeration.CreditSource;
import com.camenduru.web.domain.enumeration.CreditStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Credit.
 */
@Document(collection = "credit")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Credit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("date")
    private Instant date;

    @NotNull
    @Field("status")
    private CreditStatus status;

    @NotNull
    @Field("source")
    private CreditSource source;

    @NotNull
    @Field("total")
    private String total;

    @DBRef
    @Field("user")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Credit id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public Credit date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public CreditStatus getStatus() {
        return this.status;
    }

    public Credit status(CreditStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(CreditStatus status) {
        this.status = status;
    }

    public CreditSource getSource() {
        return this.source;
    }

    public Credit source(CreditSource source) {
        this.setSource(source);
        return this;
    }

    public void setSource(CreditSource source) {
        this.source = source;
    }

    public String getTotal() {
        return this.total;
    }

    public Credit total(String total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Credit user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Credit)) {
            return false;
        }
        return getId() != null && getId().equals(((Credit) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Credit{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", source='" + getSource() + "'" +
            ", total='" + getTotal() + "'" +
            "}";
    }
}
