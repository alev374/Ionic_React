import { Plugins } from "@capacitor/core";
import _ from "lodash";
const { Storage } = Plugins;

const storageConstructor = class StorageConstructor {
  constructor() {
    this.storage = {};
  }

  async init() {
    window.storage = this;

    // If running cypress tests, let's not load anything from storage.
    if (window.localStorage.getItem("cy")) {
      this.clear();

      // Allow cypress tests to manually set storage items upon load
      if (window.localStorage.getItem("cy-storage")) {
        this.storage = JSON.parse(window.localStorage.getItem("cy-storage"));
      }
      return;
    }

    const items = {};
    const { keys } = await Storage.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const { value } = await Storage.get({ key: key });
      items[key] = JSON.parse(value);
    }

    this.storage = items;
    console.log("storage initiated", this.storage);
  }

  async setItem(key, value) {
    this.storage = {
      ...this.storage,
      [key]: value
    };

    Storage.set({
      key: key,
      value: JSON.stringify(value)
    });
    // console.log("Storage.set", key, value);
  }

  getItem(key) {
    return _.get(this.storage, key);
  }

  async removeItem(key) {
    delete this.storage[key];
    await Storage.remove({
      key: key
    });
  }

  async clear() {
    this.storage = {};
    await Storage.clear();
  }

  getAllItems() {
    return this.storage;
  }

  /* 
    Called by Apollo Graphql
  */
  raw = {
    setItem: async (key, data) => {
      this.storage = {
        ...this.storage,
        [key]: JSON.parse(data)
      };

      await Storage.set({
        key,
        value: data
      });
    },
    getItem: async key => {
      const data = await Storage.get({ key: key });
      return data.value;
    },
    removeItem: async key => {
      await this.removeItem(key);
    },
    clear: async () => {
      await this.clear();
    }
  };
};

export default storageConstructor;
