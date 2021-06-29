import { defineCustomElements } from "@ionic/pwa-elements/loader";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const startApp = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

if (window.cordova) {
  document.addEventListener("deviceready", () => {}, false);
  // alert("CORDOVA EXISTS");
  startApp();
} else {
  startApp();
}
defineCustomElements(window);
