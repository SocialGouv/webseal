import React from "react";
import { pki } from "node-forge";

import { Row, Col, Form as BsForm, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";

const isValidKey = (key) => {
  let isValid = false;
  try {
    pki.certificateFromPem(key);
    isValid = true;
  } catch (e) {
    console.log("e", e);
  }
  return isValid;
};

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

const certificateSample = ``;

export const Form = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState,
    setValue,
    trigger,
  } = useForm({
    mode: "all",
    defaultValues: {
      pemKey: certificateSample,
      value: "",
      namespace: "",
      name: "",
      scope: "cluster",
    },
  });
  const _onSubmit = (data) => {
    //console.log("onSubmit", data);
    onSubmit(data);
  };
  const scope = getValues("scope");
  const pemKey = getValues("pemKey");
  const validKey = formState.isDirty
    ? isValidKey(pemKey)
    : isValidKey(certificateSample);
  return (
    <BsForm onSubmit={handleSubmit(_onSubmit)}>
      <Row>
        <Col>
          <BsForm.Label>
            Server public certificate (PEM key) :{" "}
            {(!validKey && "❌ Provided key is invalid") || ""}
          </BsForm.Label>
          <BsForm.Group>
            <BsForm.Control
              as="textarea"
              name="pemKey"
              style={{
                marginTop: 10,
                fontSize: "0.8rem",
                fontFamily: "Courier",
              }}
              rows={8}
              onChange={(e) => {
                setValue("pemKey", e.target.value);
                trigger();
              }}
              ref={register({ required: true })}
              placeholder={certificatePlaceholder}
              defaultValue={certificateSample}
            />
          </BsForm.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={3}>
          <BsForm.Label>Scope :</BsForm.Label>
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
          <BsForm.Label column>Namespace :</BsForm.Label>
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
          <BsForm.Label column>Secret name :</BsForm.Label>
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
          onChange={(e) => {
            setValue("value", e.target.value);
            trigger();
          }}
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
