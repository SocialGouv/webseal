import { StrictMode } from "react";
import ReactDOM from "react-dom";
import GitHubForkRibbon from "react-github-fork-ribbon";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
    <GitHubForkRibbon
      color="green"
      target="_blank"
      href="https://github.com/SocialGouv/webseal"
    >
      Fork me on GitHub
    </GitHubForkRibbon>
  </StrictMode>,
  rootElement
);
