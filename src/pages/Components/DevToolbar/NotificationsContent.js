import React, { useState, useRef } from "react";
import {
  addSeconds,
  /* addMinutes,  */ format,
  formatDistanceToNow
} from "date-fns";
import _ from "lodash";
import { notifications } from "../../../services";
import {
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonItemGroup,
  IonItemDivider
} from "@ionic/react";
import ToastContext from "../../../contexts/ToastContext";
import ReactJson from "react-json-view";

const NotificationsContent = ({ showDevModal, ...props }) => {
  const { setToast } = ToastContext.useContainer();
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const activeModalData = useRef({
    title: "All Notifications",
    name: "all_notifications",
    data: []
  });

  const showMessage = message => {
    setToast({
      message: message,
      duration: 1000,
      position: "top"
    });
  };

  const printNotificationsByCategory = async () => {
    const notificationsByCategory = [];
    const pendingNotifications = await notifications.getPendingNotifications();
    _.each(
      notifications.notificationsByCategory,
      (notificationIds, categoryName) => {
        const notifications = _.map(notificationIds, id => {
          return _.find(pendingNotifications, { id });
        });

        notificationsByCategory.push({
          categoryName,
          notifications
        });
      }
    );
    activeModalData.current = {
      title: "View Notifications",
      name: "view_notifications",
      // raw: true,
      data: notificationsByCategory
    };
    console.log("printNotificationsByCategory", notificationsByCategory);
    setShowNotificationsModal(true);
  };

  const printActionsReceived = async () => {
    const debugActions = _.get(window, "debugActions") || {};
    activeModalData.current = {
      title: "Actions Received",
      name: "actions_received",
      raw: true,
      data: debugActions
    };
    setShowNotificationsModal(true);
    console.log("printActionsReceived", debugActions);
  };

  const printNotificationsReceived = async () => {
    const debugNotificationsReceived = notifications.debugNotificationsReceived;
    activeModalData.current = {
      title: "Notifications Received",
      name: "notifications_received",
      raw: true,
      data: debugNotificationsReceived
    };
    setShowNotificationsModal(true);
    console.log("printNotificationsReceived", debugNotificationsReceived);
  };

  const cancelNotifications = async () => {
    showMessage("Cancelled all notifications");
    notifications.cancelNotifications();
  };

  const createOrUpdateFakeNotification = async ({
    actions = false,
    progressBar = false,
    seconds = 20,
    id = null,
    update = false,
    text
  }) => {
    const scheduledDate = addSeconds(new Date(), seconds);
    const newNotification = {
      title: `Test Notification`,
      text:
        text ||
        `Scheduled at ${format(
          scheduledDate,
          "MMM d, h:mm:ss a"
        )} (${seconds} seconds ago)`,
      ...(id && {
        id
      }),
      ...(actions && {
        actions: [
          { id: "test_yes", title: "Yes", launch: true },
          { id: "test_no", title: "No", ui: "decline", launch: true }
        ]
      }),
      ...(progressBar && {
        progressBar,
        clock: false,
        sticky: true
      }),
      trigger: {
        at: scheduledDate
      },
      vibrate: true,
      foreground: true,
      launch: true
    };

    if (progressBar) {
      newNotification.actions = [
        {
          id: "update_progress",
          title: "Input expense",
          type: "input",
          emptyText: "How much? e.g. 100"
        },
        { id: "test_yes", title: "Yes", launch: true },
        { id: "test_no", title: "No", ui: "decline", launch: true }
      ];

      notifications.addEventListener(
        "update_progress",
        "progressBar",
        (notification, eopts) => {
          _.set(window, `debugActions.progressBar.notification`, notification);
          _.set(window, `debugActions.progressBar.eopts`, eopts);
          const updatedNotification = {
            ...newNotification,
            progressBar: { value: 550, maxValue: 550 }
          };

          notifications.updateNotification(id, updatedNotification);
        }
      );

      notifications.addEventListener("action", "ohw", (notification, eopts) => {
        _.set(window, `debugActions.action.notification`, notification);
        _.set(window, `debugActions.action.eopts`, eopts);
      });
    } else if (actions) {
      notifications.addEventListener(
        "test_yes",
        "killerwhale",
        notification => {
          _.set(window, `debugActions.killerwhale`, notification);
          alert("killerwhale!");
        }
      );

      notifications.addEventListener(
        "test_no",
        "huntergatherer",
        notification => {
          _.set(window, `debugActions.huntergatherer`, notification);
        }
      );
    }

    if (update) {
      notifications.updateNotification(id, newNotification);
      showMessage(`Updated a notification.`);
    } else {
      notifications.createNotification(newNotification, "daily_budget");
      showMessage(`Created a notification ${seconds} seconds from now.`);
    }
  };

  return (
    <>
      <IonList>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel className="text-uppercase">View Notifications</IonLabel>
          </IonItemDivider>
          <IonItem onClick={printNotificationsByCategory} button>
            <IonLabel>View Notifications</IonLabel>
          </IonItem>
          <IonItem onClick={printActionsReceived} button>
            <IonLabel>Actions Received</IonLabel>
          </IonItem>
          <IonItem onClick={printNotificationsReceived} button>
            <IonLabel>Notifications Received</IonLabel>
          </IonItem>
        </IonItemGroup>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel className="text-uppercase">Test Notifications</IonLabel>
          </IonItemDivider>
          <IonItem
            onClick={() =>
              createOrUpdateFakeNotification({
                actions: true,
                id: 999,
                seconds: 0
              })
            }
            button
          >
            <IonLabel className="text-info">
              Create Notification (Instant)
            </IonLabel>
          </IonItem>
          <IonItem
            onClick={() =>
              createOrUpdateFakeNotification({
                id: 999,
                actions: true,
                update: true,
                seconds: 0,
                text: `Updated the notification text\nNow life is good.`
              })
            }
            button
          >
            <IonLabel className="text-info">
              Update Notification (Instant)
            </IonLabel>
          </IonItem>
          <IonItem
            onClick={() =>
              createOrUpdateFakeNotification({
                id: 999,
                actions: true,
                update: true,
                seconds: 0,
                text: [
                  { person: `Vader`, message: "I am your father" },
                  { person: `Luke`, message: "Nooo" }
                ]
              })
            }
            button
          >
            <IonLabel className="text-info">
              Update Notification (Multi-line 1)
            </IonLabel>
          </IonItem>
          <IonItem
            onClick={() =>
              createOrUpdateFakeNotification({
                seconds: 30
              })
            }
            button
          >
            <IonLabel className="text-info">
              Create Notification (30 seconds)
            </IonLabel>
          </IonItem>
          <IonItem
            onClick={() =>
              createOrUpdateFakeNotification({
                seconds: 60
              })
            }
            button
          >
            <IonLabel className="text-info">
              Create Notification (1 minutes)
            </IonLabel>
          </IonItem>
          <IonItem
            onClick={() =>
              createOrUpdateFakeNotification({
                progressBar: { value: 120, maxValue: 550 },
                seconds: 0,
                id: 123
              })
            }
            button
          >
            <IonLabel className="text-info">Progress Notification</IonLabel>
          </IonItem>
          <IonItem
            onClick={() =>
              createOrUpdateFakeNotification({
                progressBar: { value: 240, maxValue: 550 },
                seconds: 0,
                id: 123,
                update: true
              })
            }
            button
          >
            <IonLabel className="text-info">
              Update Progress Notification
            </IonLabel>
          </IonItem>
        </IonItemGroup>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel className="text-uppercase">Actions</IonLabel>
          </IonItemDivider>
          <IonItem onClick={cancelNotifications} button>
            <IonLabel className="text-danger">
              Cancel all Notifications
            </IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>
      <IonModal isOpen={showNotificationsModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                onClick={() => setShowNotificationsModal(false)}
                fill="clear"
              >
                Close
              </IonButton>
            </IonButtons>
            <IonTitle>{_.get(activeModalData.current, "title")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {_.get(activeModalData, "current.raw") ? (
              <div
                className="py-3 px-1"
                style={{
                  height: "100%",
                  backgroundColor: "rgb(43, 43, 43)"
                }}
              >
                <ReactJson
                  theme="railscasts"
                  name="notifications"
                  collapsed={1}
                  src={activeModalData.current.data}
                />
              </div>
            ) : (
              <>
                {activeModalData.current.data.map(data => (
                  <IonItemGroup key={data.categoryName}>
                    <IonItemDivider>
                      <IonLabel className="text-uppercase">
                        {_.capitalize(data.categoryName)}
                      </IonLabel>
                    </IonItemDivider>
                    {!_.isEmpty(data.notifications) ? (
                      _.sortBy(data.notifications, notification =>
                        _.get(notification, "trigger.at")
                      ).map(notification => {
                        return notification ? (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                          />
                        ) : null;
                      })
                    ) : (
                      <IonItem>
                        <IonLabel>
                          <p>There are no notifications</p>
                        </IonLabel>
                      </IonItem>
                    )}
                  </IonItemGroup>
                ))}
              </>
            )}
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

const NotificationItem = ({ notification }) => {
  const [showJson, setShowJson] = useState(false);

  return (
    <IonItem
      button={!showJson}
      onClick={() => (!showJson ? setShowJson(true) : null)}
    >
      <IonLabel>
        <h2>
          <strong>{notification.title}</strong>
        </h2>
        <h3>{notification.text}</h3>
        <p>
          {format(notification.trigger.at, "MMM d, h:mm:ss a")} (
          {formatDistanceToNow(notification.trigger.at, {
            includeSeconds: true
          })}{" "}
          from now)
        </p>
        {showJson ? (
          <>
            <div
              className="py-3 px-1 my-1"
              style={{
                height: "100%",
                backgroundColor: "rgb(43, 43, 43)"
              }}
            >
              <ReactJson
                theme="railscasts"
                name="notification"
                collapsed={1}
                src={notification}
              />
            </div>
            <IonButton
              fill="clear"
              size="small"
              onClick={() => setShowJson(false)}
            >
              Close
            </IonButton>
          </>
        ) : null}
      </IonLabel>
    </IonItem>
  );
};

export default NotificationsContent;
