import React, { useState, useRef } from "react";
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
  IonContent
} from "@ionic/react";
// import ToastContext from "../../../contexts/ToastContext";
import ReactJson from "react-json-view";
import { notifications } from "../../../services";
import useReactRouter from "use-react-router";

const DebugContent = ({ closeDevModal }) => {
  const {
    history,
    location: { pathname }
  } = useReactRouter();
  const [showModal, setShowModal] = useState(false);

  const quickLockout = () => {
    history.push({
      pathname,
      search: "?lockoutTime=1000&lockoutTimeCountdown=5"
    });
    closeDevModal();
  };

  const setupPin = () => {
    history.push("/auth/pin/setup");
    closeDevModal();
  };
  return (
    <>
      <IonList>
        <IonItem onClick={() => setShowModal("Print Debug Info")} button>
          <IonLabel>
            <span className="">Print Debug Info</span>
          </IonLabel>
        </IonItem>
        <IonItem onClick={() => quickLockout()} button>
          <IonLabel>
            <span className="text-tertiary">Quick Lockout</span>
          </IonLabel>
        </IonItem>
        <IonItem onClick={() => setupPin()} button>
          <IonLabel>
            <span className="text-tertiary">Change PIN Code</span>
          </IonLabel>
        </IonItem>
      </IonList>

      <IonModal isOpen={!!showModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setShowModal(false)} fill="clear">
                Close
              </IonButton>
            </IonButtons>
            <IonTitle>{showModal}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {showModal === "Print Debug Info" ? <DebugPrintInfo /> : null}
        </IonContent>
      </IonModal>
    </>
  );
};

const DebugPrintInfo = () => {
  // const { setToast } = ToastContext.useContainer();
  const [showModal, setShowModal] = useState(false);
  const json = useRef({});

  /*   const showMessage = message => {
    setToast({
      message: message,
      duration: 1000,
      position: "top"
    });
  }; */

  const printData = async name => {
    let showModal = true;
    switch (name) {
      case "window.Capacitor":
        json.current = window.Capacitor;
        console.log("window.Capacitor", window.Capacitor);
        break;
      case "window.cordova":
        json.current = window.cordova;
        console.log("window.cordova", window.cordova);
        break;
      case "window.Ionic":
        json.current = window.Ionic;
        console.log("window.Ionic", window.Ionic);
        break;
      case "notifications.getDefaults":
        json.current = notifications.localNotifications.getDefaults();
        console.log(
          "notifications.getDefaults()",
          notifications.localNotifications.getDefaults()
        );
        break;
      case "notifications.getScheduled":
        showModal = false;
        notifications.localNotifications.getScheduled(data => {
          json.current = data;
          console.log("notifications.getScheduled()", data);
          setShowModal(name);
        });
        break;
      case "notifications.getScheduledIds":
        showModal = false;
        notifications.localNotifications.getScheduledIds(data => {
          json.current = data;
          console.log("notifications.getScheduledIds()", data);
          setShowModal(name);
        });
        break;
      default:
        json.current = {};
        break;
    }

    if (showModal) {
      setShowModal(name);
    }
  };

  return (
    <>
      <IonList>
        <IonItem onClick={() => printData("window.Capacitor")} button>
          <IonLabel>
            <span className="text-monospace text-info font-weight-bold">
              window.Capacitor
            </span>
          </IonLabel>
        </IonItem>
        <IonItem onClick={() => printData("window.cordova")} button>
          <IonLabel>
            <span className="text-monospace text-info font-weight-bold">
              window.cordova
            </span>
          </IonLabel>
        </IonItem>
        <IonItem onClick={() => printData("window.Ionic")} button>
          <IonLabel>
            <span className="text-monospace text-info font-weight-bold">
              window.Ionic
            </span>
          </IonLabel>
        </IonItem>
        <IonItem onClick={() => printData("notifications.getDefaults")} button>
          <IonLabel>
            <span className="text-monospace text-info font-weight-bold">
              localNotifications.getDefaults()
            </span>
          </IonLabel>
        </IonItem>
        <IonItem onClick={() => printData("notifications.getScheduled")} button>
          <IonLabel>
            <span className="text-monospace text-info font-weight-bold">
              localNotifications.getScheduled()
            </span>
          </IonLabel>
        </IonItem>
        <IonItem
          onClick={() => printData("notifications.getScheduledIds")}
          button
        >
          <IonLabel>
            <span className="text-monospace text-info font-weight-bold">
              localNotifications.getScheduledIds()
            </span>
          </IonLabel>
        </IonItem>
      </IonList>

      <IonModal isOpen={!!showModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setShowModal(false)} fill="clear">
                Close
              </IonButton>
            </IonButtons>
            <IonTitle>{showModal}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div
            className="py-3 px-1"
            style={{
              height: "100%",
              backgroundColor: "rgb(43, 43, 43)"
            }}
          >
            <ReactJson theme="railscasts" collapsed={true} src={json.current} />
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default DebugContent;
