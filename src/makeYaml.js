import YAML from "yaml";

export const makeYaml = ({
  namespace = "some-namespace",
  name = "some-secret-name",
  scope = "strict",
  encryptedData,
}) => {
  const annotations = {};
  if (scope === "cluster") {
    annotations["sealedsecrets.bitnami.com/cluster-wide"] = "true";
  } else if (scope === "namespace") {
    annotations["sealedsecrets.bitnami.com/namespace-wide"] = "true";
  }

  const manifest = {
    apiVersion: "bitnami.com/v1alpha1",
    kind: "SealedSecret",
    metadata: {
      annotations,
      name,
      namespace,
    },
    spec: {
      encryptedData,
    },
    template: {
      metadata: {
        annotations,
        name,
      },
      type: "Opaque",
    },
  };

  return YAML.stringify(manifest);
};
