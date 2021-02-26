import React, { useState } from "react";
import { Card, Jumbotron, Container, Row, Col } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import { Form } from "./Form";
import { makeSecret } from "./makeSecret";
import { makeYaml } from "./makeYaml";

const Intro = () => (
  <Jumbotron style={{ padding: "2rem 1rem" }}>
    <h1>WebSeal</h1>
    <p>Client-side sealed-secrets generation</p>
  </Jumbotron>
);

const Editor = () => {
  const [encrypted, setEncrypted] = useState(null);
  const [yaml, setYaml] = useState(null);
  const onSubmit = (data) => {
    console.log("onSubmit2", data);
    setEncrypted("");
    setYaml("");
    makeSecret(data)
      .then((value) => {
        setEncrypted(value);
        const newYaml = makeYaml({
          namespace: data.namespace,
          name: data.name,
          scope: data.scope,
          encryptedData: {
            VALUE: value,
          },
        });

        setYaml(newYaml);
      })
      .catch(console.log);
  };
  return (
    <Container>
      <Intro />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Form onSubmit={onSubmit} />
            </Card.Body>
          </Card>
          {encrypted && (
            <>
              <Card style={{ marginTop: 10 }}>
                <Card.Body>
                  <Card.Title>Encrypted</Card.Title>
                  <div>{encrypted}</div>
                </Card.Body>
              </Card>
              <Card style={{ marginTop: 10 }}>
                <Card.Body>
                  <Card.Title>SealedSecret</Card.Title>
                  <textarea
                    style={{
                      whiteSpace: "pre",
                      fontSize: "0.8rem",
                      fontFamily: "Courier",
                      width: "100%",
                      padding: 5,
                      height: 400,
                    }}
                    defaultValue={yaml}
                  ></textarea>
                </Card.Body>
              </Card>
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
