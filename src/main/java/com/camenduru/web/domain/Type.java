package com.camenduru.web.domain;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Type.
 */
@Document(collection = "type")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Type implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("type")
    private String type;

    @NotNull
    @Field("amount")
    private String amount;

    @NotNull
    @Field("schema")
    private String schema;

    @NotNull
    @Field("model")
    private String model;

    @NotNull
    @Field("title")
    private String title;

    @NotNull
    @Field("is_default")
    private Boolean isDefault;

    @NotNull
    @Field("is_active")
    private Boolean isActive;

    @NotNull
    @Field("is_free")
    private Boolean isFree;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Type id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return this.type;
    }

    public Type type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAmount() {
        return this.amount;
    }

    public Type amount(String amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getSchema() {
        return this.schema;
    }

    public Type schema(String schema) {
        this.setSchema(schema);
        return this;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public String getModel() {
        return this.model;
    }

    public Type model(String model) {
        this.setModel(model);
        return this;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getTitle() {
        return this.title;
    }

    public Type title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getIsDefault() {
        return this.isDefault;
    }

    public Type isDefault(Boolean isDefault) {
        this.setIsDefault(isDefault);
        return this;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public Type isActive(Boolean isActive) {
        this.setIsActive(isActive);
        return this;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsFree() {
        return this.isFree;
    }

    public Type isFree(Boolean isFree) {
        this.setIsFree(isFree);
        return this;
    }

    public void setIsFree(Boolean isFree) {
        this.isFree = isFree;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Type)) {
            return false;
        }
        return getId() != null && getId().equals(((Type) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Type{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", amount='" + getAmount() + "'" +
            ", schema='" + getSchema() + "'" +
            ", model='" + getModel() + "'" +
            ", title='" + getTitle() + "'" +
            ", isDefault='" + getIsDefault() + "'" +
            ", isActive='" + getIsActive() + "'" +
            ", isFree='" + getIsFree() + "'" +
            "}";
    }
}
