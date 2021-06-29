/* 
  Uses katzer's cordova-local-notifications:
  - https://github.com/katzer/cordova-plugin-local-notifications
  - https://github.com/katzer/cordova-plugin-local-notifications/blob/master/www/local-notification.js

  Wrapped with Ionic local-notifications
  - https://github.com/ionic-team/ionic-native/blob/master/src/%40ionic-native/plugins/local-notifications/index.ts
*/

import _ from "lodash";
// import storage from "./storage";
import actionTypes from "./notifications/actionTypes";
import { LocalNotifications } from "@ionic-native/local-notifications";

const notificationsConstructor = class NotificationsConstructor {
  constructor({ storage }) {
    this.localNotifications = LocalNotifications;
    this.storage = storage;
    this.notificationsByCategory = {};

    this.eventListeners = {};
  }

  async init() {
    const self = this;
    self.localNotifications.requestPermission();

    self.notificationsByCategory =
      self.storage.getItem("notificationsByCategory") || {};

    try {
      for (let i = 0; i < actionTypes.length; i++) {
        const { id, actions } = actionTypes[i];
        self.localNotifications.addActions(id, actions);
      }
    } catch (e) {
      console.log(e);
    }
    console.log("notifications initiated");

    try {
      self.pruneNotifications();
    } catch (e) {
      console.log(e);
    }
  }

  addEventListener(eventName, actionName, func) {
    const self = this;

    // Unsubscribe from existing listener if ever...
    const existingEventListener = _.get(
      self.eventListeners,
      `${eventName}.${actionName}`
    );
    if (existingEventListener) {
      existingEventListener.unsubscribe();
    }

    // Create the listener...
    _.set(
      self.eventListeners,
      `${eventName}.${actionName}`,
      self.localNotifications.on(eventName).subscribe((notification, eopts) => {
        func(notification, eopts);
      })
    );
  }

  removeEventListener(eventName, actionName) {
    const self = this;
    const existingEventListener = _.get(
      self.eventListeners,
      `${eventName}.${actionName}`
    );
    if (existingEventListener) {
      existingEventListener.unsubscribe();
      _.unset(self.eventListeners, `${eventName}.${actionName}`);
    }
  }

  /* 
    Remove notifications from storage that no longer exist
  */
  async pruneNotifications() {
    const pendingNotificationIds = await this.getPendingNotificationIds();

    const notificationsByCategoryCache = this.storage.getItem(
      "notificationsByCategory"
    );

    let prunedNotificationsByCategory = {};
    _.each(notificationsByCategoryCache, (notificationIds, categoryName) => {
      let prunedNotificationIds = _.filter(notificationIds, id => {
        return (
          _.findIndex(pendingNotificationIds, {
            id
          }) > -1
        );
      });

      prunedNotificationsByCategory[categoryName] = prunedNotificationIds;
    });
    this.storage.setItem(
      "notificationsByCategory",
      prunedNotificationsByCategory
    );
  }

  async getPendingNotifications() {
    return await this.localNotifications.getScheduled();
  }

  async getPendingNotificationIds() {
    return await this.localNotifications.getScheduledIds();
  }

  async cancelNotifications(categoryName) {
    let notificationsToDelete;
    if (categoryName === "all") {
      await this.localNotifications.cancelAll();
    } else {
      if (categoryName && _.get(this.notificationsByCategory, categoryName)) {
        notificationsToDelete = this.notificationsByCategory[categoryName];
      } else {
        const pendingNotifications = await this.getPendingNotifications();
        notificationsToDelete = _.map(pendingNotifications, "id");
      }

      for (let i = 0; i < notificationsToDelete.length; i++) {
        const notificationId = notificationsToDelete[i];
        await this.localNotifications.cancel(notificationId);
      }
    }

    console.log("cancelNotifications");
    this.pruneNotifications();
  }

  async createNotification(notifs, categoryName = "uncategorized") {
    // console.log("createNotification", notifs);
    let notificationsWithoutIds;
    let notifications = [];
    let notificationsInCategory = [];
    let pendingNotifications = this.getPendingNotifications();

    if (_.isArray(notifs)) {
      notificationsWithoutIds = notifs;
    } else {
      notificationsWithoutIds = [notifs];
    }

    _.each(notificationsWithoutIds, notification => {
      let uniqueId = notification.id || false;

      // Create id if none is passed
      while (!uniqueId) {
        const id = Math.floor(Math.random() * 100000);
        const existingNotification = _.findIndex(pendingNotifications, {
          id
        });
        if (existingNotification === -1) {
          uniqueId = id;
        }
      }

      notifications.push({
        ...notification,
        id: uniqueId
      });

      notificationsInCategory.push(uniqueId);
    });

    this.localNotifications.schedule(notifications);

    // Update notificationsByCategory service object
    if (_.get(this.notificationsByCategory, categoryName)) {
      this.notificationsByCategory[categoryName] = _.concat(
        this.notificationsByCategory[categoryName],
        notificationsInCategory
      );
    } else {
      this.notificationsByCategory[categoryName] = notificationsInCategory;
    }

    // Update storage
    await this.storage.setItem(
      "notificationsByCategory",
      this.notificationsByCategory
    );
  }

  async updateNotification(id, notifs) {
    this.localNotifications.update({
      ...notifs,
      id
    });
  }
};

export default notificationsConstructor;
