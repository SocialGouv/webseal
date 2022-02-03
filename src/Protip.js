import React from "react";

import { Card } from "react-bootstrap";

const tips = [
  {
    title: "⚓️ Use the URL luke",
    description:
      "We provide a safe and friendly URL to create new secrets with the same parameters",
  },
  {
    title: "🔐 Use a strict scope",
    description:
      "Using a strict scope is recommended to increase your sealed-secret robustness",
  },
  {
    title: "📦 A sealed-secret produce a readable Kubernetes Secret",
    description:
      "Once unencrypted in the destination namespace, your sealed-secret creates a standard kubernetes Secret.",
  },
  {
    title: "👨‍⚕️ kubectl get events --field-selector involvedObject.kind=\"SealedSecret\"",
    description: "If decryption fails, kubectl events will tell you"
  }
];

export const Protip = () => {
  return tips.map((tip) => (
    <Card style={{ marginTop: 10 }}>
      <Card.Body>
        <h5>{tip.title}</h5>
        {tip.description}
      </Card.Body>
    </Card>
  ));
};
