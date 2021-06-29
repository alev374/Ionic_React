import { Plugins } from "@capacitor/core";
import _ from "lodash";
const { Network } = Plugins;

const networkConstructor = class NetworkConstructor {
  constructor() {
    this.online = false;
    this.client = null;
    this.listeners = [];
  }

  async init(client) {
    this.client = client;

    Network.addListener(
      "networkStatusChange",
      ({ connected, connectionType }) => {
        console.log("Network status changed", {
          connected,
          connectionType
        });
        this.setOnline(connected);
      }
    );

    const { connected } = await Network.getStatus();
    this.setOnline(connected);
  }

  setOnline(connected) {
    this.online = connected;
    if (connected) {
      console.log("client.queueLink.open()");
      this.client.queueLink.open();
    } else {
      console.log("client.queueLink.close()");
      this.client.queueLink.close();
    }

    _.each(this.listeners, fn => {
      fn(connected);
    });
  }

  addListener(fn) {
    this.listeners.push(fn);
  }
};

export default networkConstructor;
