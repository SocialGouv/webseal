import React from "react";
import { pki } from "node-forge";

import { Row, Col, Form as BsForm, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHashParams } from "./useHashParams";
import { isValidKey } from "./isValidKey";

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

const isValidParamsKey = (key) =>
  ["namespace", "scope", "cluster", "name", "pemKey"].includes(key);

const removeInvalidKeys = (keyValidator) => (object) =>
  Object.keys(object)
    .filter(keyValidator)
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: object[key],
      }),
      {}
    );

const keepValidParamKeys = removeInvalidKeys(isValidParamsKey);

const certificatePlaceholder = `-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----`;

export const Form = ({ onSubmit, initialFormData }) => {
  const [hashParamsData, setHashParamsData] = useHashParams();

  const hashParams = keepValidParamKeys(hashParamsData);

  const defaultValues = {
    ...initialFormData,
    ...hashParams,
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    getValues,
    formState,
  } = useForm({
    mode: "onChange",
    defaultValues,
  });

  const _onSubmit = (data) => {
    setHashParamsData(keepValidParamKeys(data));
    onSubmit(data);
  };

  //const cluster = watch("cluster");
  //const scope = watch("scope");
  const value = watch("value");
  const pemKey = watch("pemKey");

  const validKey = isValidKey(pemKey);

  React.useEffect(() => {
    const subscription = watch(
      ("value",
      ({ name, type }) => {
        const values = getValues();
        //console.log("value", values, values);
        // if (isValidKey(values.pemKey)) {
        _onSubmit(values);
        // }
      })
    );
    return () => subscription.unsubscribe && subscription.unsubscribe();
  }, [watch]);

  return (
    <BsForm onSubmit={handleSubmit(_onSubmit)}>
      <Card>
        <Card.Body>
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
                  {...register("pemKey", { required: true })}
                  placeholder={certificatePlaceholder}
                />
              </BsForm.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <BsForm.Label style={{ marginRight: 10 }}>Scope :</BsForm.Label>
            </Col>
            <Col xs={10}>
              <RadioChoice
                name="scope"
                value="cluster"
                {...register("scope")}
                onChange={(e) => {
                  setValue("scope", e.target.value);
                  trigger();
                }}
              />
              <RadioChoice
                name="scope"
                value="namespace"
                {...register("scope")}
                onChange={(e) => {
                  setValue("scope", e.target.value);
                  trigger();
                }}
              />
              <RadioChoice
                name="scope"
                value="strict"
                {...register("scope")}
                onChange={(e) => {
                  setValue("scope", e.target.value);
                  trigger();
                }}
              />
            </Col>
          </Row>
          <BsForm.Group as={Row}>
            <BsForm.Label column>Namespace :</BsForm.Label>
            <Col xs="10">
              <BsForm.Control
                name="namespace"
                {...register("namespace", { required: true })}
                required
                type="text"
                placeholder="Namespace"
              />
            </Col>
          </BsForm.Group>
          <BsForm.Group as={Row}>
            <BsForm.Label column>Secret name :</BsForm.Label>
            <Col xs="10">
              <BsForm.Control
                name="name"
                {...register("name", { required: true })}
                type="text"
                placeholder="Secret name"
              />
            </Col>
          </BsForm.Group>
        </Card.Body>
      </Card>
      <Card style={{ marginTop: 10 }}>
        <Card.Body>
          <BsForm.Group>
            <h4>Values to encrypt :</h4>
            <BsForm.Control
              as="textarea"
              name="value"
              id="value"
              style={{ marginTop: 10 }}
              rows={4}
              {...register("value", { required: true, value })}
              placeholder={`MY_TOKEN=SomeSuperSecretToken
MY_PASSWORD=SomeSuperSecretPassword`}
            />
          </BsForm.Group>
        </Card.Body>
      </Card>
    </BsForm>
  );
};
