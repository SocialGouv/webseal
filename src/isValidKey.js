import { pki } from "node-forge";

export const isValidKey = (key) => {
  let isValid = false;
  try {
    pki.certificateFromPem(key);
    isValid = true;
  } catch (e) {
    console.log("e", e);
  }
  return isValid;
};
