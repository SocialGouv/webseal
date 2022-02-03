import React, { useState } from "react";
import { Card, Jumbotron, Container, Row, Col } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Clipboard } from "react-feather";
import yaml from "js-yaml";
import { encryptValue, getSealedSecret } from "@socialgouv/aes-gcm-rsa-oaep";

import "bootstrap/dist/css/bootstrap.min.css";

import { isValidKey } from "./isValidKey";
import { Form } from "./Form";
import { Protip } from "./Protip";

const Intro = () => (
  <Jumbotron
    style={{ marginTop: "1rem", marginBottom: "1rem", padding: "1rem 1rem" }}
  >
    <h1>WebSeal</h1>
    <p>Client-side sealed-secrets generation</p>
  </Jumbotron>
);

const CodeArea = (props) => (
  <textarea
    {...props}
    style={{
      fontSize: "0.8rem",
      fontFamily: "Courier",
      border: "1px solid #ccc",
      width: "100%",
      padding: 5,
      height: 400,
      ...(props.style || {}),
    }}
  ></textarea>
);

const Copier = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      <Clipboard
        style={{
          marginLeft: 10,
          cursor: "pointer",
          transition: "all 0.2s ease-in",
        }}
        color={copied ? "green" : "black"}
        title="Copy"
        size={16}
      />
    </CopyToClipboard>
  );
};

const Editor = () => {
  const [formData, setFormData] = useState({
    cluster: "dev",
    namespace: "",
    name: "",
    pemKey: "",
  });
  const [encrypted, setEncrypted] = useState(null);
  const [yamlResult, setYamlResult] = useState(null);
  const onSubmit = async (data) => {
    //console.log("onSubmit2", data);
    const validKey = isValidKey(data.pemKey);
    setFormData(data);
    setEncrypted("");
    setYamlResult("");
    if (!validKey) {
      return;
    }
    if (data.value && data.value !== formData.value) {
      const pemKey = data.pemKey;
      const values = {};
      if (data.value.match(/^([\w_\d]+)=(.+)$/im)) {
        data.value.split("\n").forEach((row) => {
          const matches = row.match(/^([\w_\d]+)=(.*)$/i);
          if (matches) {
            values[matches[1]] = matches[2];
          }
        });
      } else {
        values.VALUE = data.value;
      }
      let sealedSecret;
      try {
        sealedSecret = await getSealedSecret({
          pemKey,
          namespace: data.namespace || "some-namespace",
          name: data.name || "some-secret-name",
          scope: data.scope,
          values,
        });
      } catch (e) {
        console.log("cannot create sealed secret", e.message);
        return;
      }
      if (data.scope === "strict" && (!data.namespace || !data.name)) {
        console.log("namespace and name are mandatory");
        setYamlResult("");
        setEncrypted("");
      } else if (data.scope === "namespace" && !data.namespace) {
        console.log("namespace is mandatory");
        setYamlResult("");
        setEncrypted("");
      } else if (!data.value) {
        console.log("value is mandatory");
        setYamlResult("");
        setEncrypted("");
      } else {
        const keys = Object.keys(values);
        if (keys.length === 1) {
          setEncrypted(sealedSecret.spec.encryptedData[keys[0]]);
        } else {
          setEncrypted(
            "Not available for multiple values, use the below secret"
          );
        }
        setYamlResult(yaml.dump(sealedSecret, { noRefs: true, lineWidth: -1 }));
      }
    }
  };
  return (
    <Container>
      <Intro />
      <Row>
        <Col xs={12}>
          <Form onSubmit={onSubmit} initialFormData={formData} />
          {encrypted && (
            <>
              <Card style={{ marginTop: 10 }}>
                <Card.Body>
                  <Card.Title>
                    SealedSecret <Copier text={yamlResult} />
                  </Card.Title>
                  <CodeArea defaultValue={yamlResult} />
                </Card.Body>
              </Card>
              <Protip />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default function App() {
  return (
    <div className="App">
      <Editor />
    </div>
  );
}
