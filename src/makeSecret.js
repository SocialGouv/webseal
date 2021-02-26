import { pki } from "node-forge";
import {
  HybridEncrypt,
  pemPublicKeyToCryptoKey,
} from "@socialgouv/aes-gcm-rsa-oaep";

// https://github.com/bitnami-labs/sealed-secrets/blob/717b7c1cae24af1ead57992b78196ff6dc70025e/pkg/apis/sealed-secrets/v1alpha1/sealedsecret_expansion.go#L77
const getLabel = ({ scope, namespace, name }) => {
  if (scope === "cluster") {
    return "";
  } else if (scope === "namespace") {
    return namespace;
  }
  return `${namespace}/${name}`;
};

export const makeSecret = async ({ pemKey, scope, namespace, name, value }) => {
  const cert = pki.certificateFromPem(pemKey);
  const publicKeyPem = pki.publicKeyToPem(cert.publicKey);
  const publicKey = await pemPublicKeyToCryptoKey(publicKeyPem);
  const label = Buffer.from(getLabel({ scope, namespace, name }));
  const result = await HybridEncrypt(publicKey, value, label);
  return Buffer.from(result).toString("base64");
};
