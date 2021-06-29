import React, { useState, useRef } from "react";
import { storage } from "../../../services";
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
import useReactRouter from "use-react-router";
import ToastContext from "../../../contexts/ToastContext";
import ReactJson from "react-json-view";

const StorageContent = ({ showDevModal, ...props }) => {
  const { setToast } = ToastContext.useContainer();
  const { history } = useReactRouter();
  const [showStorage, setShowStorage] = useState(false);
  const storageJson = useRef({});

  const showMessage = message => {
    setToast({
      message: message,
      duration: 1000,
      position: "top"
    });
  };

  const printStorage = async () => {
    const storageItems = storage.getAllItems();
    storageJson.current = storageItems;
    setShowStorage(true);
    console.log(storageItems);
  };

  const clearTrackedQueries = async () => {
    await storage.removeItem("trackedQueries");
    showMessage("Removed trackedQueries");
  };

  const clearStorage = async () => {
    await storage.clear();
    showMessage("Storage has been cleared.");
    history.push("/auth/login");
  };

  return (
    <>
      <IonList>
        <IonItem onClick={printStorage} button>
          <IonLabel>Print Storage</IonLabel>
        </IonItem>
        <IonItem onClick={clearTrackedQueries} button>
          <IonLabel className="text-tertiary">Clear Tracked Queries</IonLabel>
        </IonItem>
        <IonItem onClick={clearStorage} button>
          <IonLabel className="text-danger">Clear Storage</IonLabel>
        </IonItem>
      </IonList>
      <IonModal isOpen={showStorage}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setShowStorage(false)} fill="clear">
                Close
              </IonButton>
            </IonButtons>
            <IonTitle>Storage</IonTitle>
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
            <ReactJson
              theme="railscasts"
              collapsed={true}
              src={storageJson.current}
            />
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default StorageContent;
