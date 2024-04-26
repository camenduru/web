package com.camenduru.web.domain;

import com.camenduru.web.domain.enumeration.JobSource;
import com.camenduru.web.domain.enumeration.JobStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Job.
 */
@Document(collection = "job")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Job implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("date")
    private Instant date;

    @NotNull
    @Field("status")
    private JobStatus status;

    @NotNull
    @Field("source")
    private JobSource source;

    @NotNull
    @Field("source_id")
    private String sourceId;

    @NotNull
    @Field("source_channel")
    private String sourceChannel;

    @NotNull
    @Field("command")
    private String command;

    @NotNull
    @Field("type")
    private String type;

    @NotNull
    @Field("amount")
    private String amount;

    @NotNull
    @Field("result")
    private String result;

    @DBRef
    @Field("user")
    private User user;

    @DBRef
    @Field("discord")
    private Detail discord;

    @DBRef
    @Field("total")
    private Detail total;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Job id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public Job date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public JobStatus getStatus() {
        return this.status;
    }

    public Job status(JobStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public JobSource getSource() {
        return this.source;
    }

    public Job source(JobSource source) {
        this.setSource(source);
        return this;
    }

    public void setSource(JobSource source) {
        this.source = source;
    }

    public String getSourceId() {
        return this.sourceId;
    }

    public Job sourceId(String sourceId) {
        this.setSourceId(sourceId);
        return this;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public String getSourceChannel() {
        return this.sourceChannel;
    }

    public Job sourceChannel(String sourceChannel) {
        this.setSourceChannel(sourceChannel);
        return this;
    }

    public void setSourceChannel(String sourceChannel) {
        this.sourceChannel = sourceChannel;
    }

    public String getCommand() {
        return this.command;
    }

    public Job command(String command) {
        this.setCommand(command);
        return this;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public String getType() {
        return this.type;
    }

    public Job type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAmount() {
        return this.amount;
    }

    public Job amount(String amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getResult() {
        return this.result;
    }

    public Job result(String result) {
        this.setResult(result);
        return this;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Job user(User user) {
        this.setUser(user);
        return this;
    }

    public Detail getDiscord() {
        return this.discord;
    }

    public void setDiscord(Detail detail) {
        this.discord = detail;
    }

    public Job discord(Detail detail) {
        this.setDiscord(detail);
        return this;
    }

    public Detail getTotal() {
        return this.total;
    }

    public void setTotal(Detail detail) {
        this.total = detail;
    }

    public Job total(Detail detail) {
        this.setTotal(detail);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Job)) {
            return false;
        }
        return getId() != null && getId().equals(((Job) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Job{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", source='" + getSource() + "'" +
            ", sourceId='" + getSourceId() + "'" +
            ", sourceChannel='" + getSourceChannel() + "'" +
            ", command='" + getCommand() + "'" +
            ", type='" + getType() + "'" +
            ", amount='" + getAmount() + "'" +
            ", result='" + getResult() + "'" +
            "}";
    }
}
