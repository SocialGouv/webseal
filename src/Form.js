import React from "react";

import { Row, Col, Form as BsForm, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";

const RadioChoice = React.forwardRef(({ name, value, ...props }, ref) => (
  <BsForm.Check
    inline
    ref={ref}
    name={name}
    id={`${name}-${value}`}
    label={value}
    type="radio"
    value={value}
    {...props}
  />
));

const certificatePlaceholder = `-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----`;

export const Form = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState,
    setValue,
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      pemKey: "",
      value: "",
      namespace: "",
      name: "",
      scope: "cluster",
    },
  });
  const _onSubmit = (data) => {
    console.log("onSubmit", data);
    onSubmit(data);
  };
  const scope = getValues("scope");
  //console.log("scope", scope);
  return (
    <BsForm onSubmit={handleSubmit(_onSubmit)}>
      <Row>
        <Col>
          <BsForm.Label>Server public certificate (PEM key) :</BsForm.Label>
          <BsForm.Group>
            <BsForm.Control
              as="textarea"
              name="pemKey"
              defaultValue={certificatePlaceholder}
              style={{
                marginTop: 10,
                fontSize: "0.8rem",
                fontFamily: "Courier",
              }}
              rows={8}
              ref={register({ required: true })}
              placeholder={certificatePlaceholder}
            />
          </BsForm.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={3}>
          <BsForm.Label>Scope</BsForm.Label>
        </Col>
        <Col sm={9}>
          <RadioChoice
            name="scope"
            value="cluster"
            ref={register}
            onChange={(e) => {
              setValue("scope", e.target.value);
              trigger();
            }}
          />
          <RadioChoice
            name="scope"
            value="namespace"
            ref={register}
            onChange={(e) => {
              setValue("scope", e.target.value);
              trigger();
            }}
          />
          <RadioChoice
            name="scope"
            value="strict"
            ref={register}
            onChange={(e) => {
              setValue("scope", e.target.value);
              trigger();
            }}
          />
        </Col>
      </Row>
      {(scope === "namespace" || scope === "strict") && (
        <BsForm.Group as={Row}>
          <BsForm.Label column>Namespace</BsForm.Label>
          <Col sm="9">
            <BsForm.Control
              name="namespace"
              ref={register({ required: true })}
              required
              type="text"
              placeholder="Namespace"
            />
          </Col>
        </BsForm.Group>
      )}
      {scope === "strict" && (
        <BsForm.Group as={Row}>
          <BsForm.Label column>Secret name</BsForm.Label>
          <Col sm="9">
            <BsForm.Control
              name="name"
              ref={register({ required: true })}
              type="text"
              placeholder="Secret name"
            />
          </Col>
        </BsForm.Group>
      )}
      <BsForm.Group>
        <BsForm.Control
          as="textarea"
          name="value"
          style={{ marginTop: 10 }}
          rows={4}
          ref={register({ required: true })}
          placeholder="Value to encrypt"
        />
      </BsForm.Group>
      <Button
        disabled={!formState.isDirty || !formState.isValid}
        block
        variant="primary"
        type="submit"
      >
        Encrypt
      </Button>
    </BsForm>
  );
};
