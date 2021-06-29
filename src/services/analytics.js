import { Plugins } from "@capacitor/core";
import _ from "lodash";
const { AnalyticsWebInterface } = Plugins;

const analyticsConstructor = class AnalyticsConstructor {
  constructor() {
    this.userId = null;
    this.screenName = null;
    this.userProperties = {};
    // this.logEvent =
  }

  async init() {
    console.log("analytics initiated");
  }

  logEvent = _.debounce((name, parameters) => {
    // console.log("logEvent", name, parameters);
    return AnalyticsWebInterface.logEvent({ name, parameters });
  }, 300);

  setUserProperty(name, value) {
    const existingProperty = _.get(this.userProperties, name);
    if (existingProperty && _.isEqual(existingProperty, value)) {
      return;
    }
    // console.log("setUserProperty", name, value);
    this.userProperties[name] = value;
    AnalyticsWebInterface.setUserProperty({ name, value });
  }

  setUserId(userId) {
    if (this.userId === userId) {
      return;
    }
    // console.log("setUserId", userId);
    this.userId = userId;
    AnalyticsWebInterface.setUserId(userId);
  }

  setScreenName(screenName, screenClassOverride) {
    if (this.screenName === screenName) {
      return;
    }
    this.screenName = screenName;
    AnalyticsWebInterface.setScreenName({ screenName, screenClassOverride });
  }

  appInstanceId() {
    AnalyticsWebInterface.appInstanceId();
  }

  resetAnalyticsData() {
    AnalyticsWebInterface.resetAnalyticsData();
  }
};

export default analyticsConstructor;
