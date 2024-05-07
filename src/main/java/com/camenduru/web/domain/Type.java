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
    @Field("description")
    private String description;

    @NotNull
    @Field("image")
    private String image;

    @NotNull
    @Field("readme")
    private String readme;

    @NotNull
    @Field("web")
    private String web;

    @NotNull
    @Field("paper")
    private String paper;

    @NotNull
    @Field("code")
    private String code;

    @NotNull
    @Field("jupyter")
    private String jupyter;

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

    public String getDescription() {
        return this.description;
    }

    public Type description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return this.image;
    }

    public Type image(String image) {
        this.setImage(image);
        return this;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getReadme() {
        return this.readme;
    }

    public Type readme(String readme) {
        this.setReadme(readme);
        return this;
    }

    public void setReadme(String readme) {
        this.readme = readme;
    }

    public String getWeb() {
        return this.web;
    }

    public Type web(String web) {
        this.setWeb(web);
        return this;
    }

    public void setWeb(String web) {
        this.web = web;
    }

    public String getPaper() {
        return this.paper;
    }

    public Type paper(String paper) {
        this.setPaper(paper);
        return this;
    }

    public void setPaper(String paper) {
        this.paper = paper;
    }

    public String getCode() {
        return this.code;
    }

    public Type code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getJupyter() {
        return this.jupyter;
    }

    public Type jupyter(String jupyter) {
        this.setJupyter(jupyter);
        return this;
    }

    public void setJupyter(String jupyter) {
        this.jupyter = jupyter;
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
            ", description='" + getDescription() + "'" +
            ", image='" + getImage() + "'" +
            ", readme='" + getReadme() + "'" +
            ", web='" + getWeb() + "'" +
            ", paper='" + getPaper() + "'" +
            ", code='" + getCode() + "'" +
            ", jupyter='" + getJupyter() + "'" +
            "}";
    }
}
