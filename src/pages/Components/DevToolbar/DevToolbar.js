import React, { useState } from "react";
import {
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonTitle
} from "@ionic/react";
import { cog } from "ionicons/icons";
import _ from "lodash";

import DebugContent from "./DebugContent";
import StorageContent from "./StorageContent";
import NotificationsContent from "./NotificationsContent";

const DevModal = ({
  showDevModal,
  toggleDevModal,
  closeDevModal,
  ...props
}) => {
  return (
    <IonModal isOpen={!!showDevModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => toggleDevModal(null)} fill="clear">
              Close
            </IonButton>
          </IonButtons>
          <IonTitle>{_.capitalize(showDevModal)}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {showDevModal === "storage" ? (
          <StorageContent
            showDevModal={showDevModal}
            toggleDevModal={toggleDevModal}
            closeDevModal={closeDevModal}
          />
        ) : showDevModal === "notifications" ? (
          <NotificationsContent
            showDevModal={showDevModal}
            toggleDevModal={toggleDevModal}
            closeDevModal={closeDevModal}
          />
        ) : showDevModal === "debug" ? (
          <DebugContent
            showDevModal={showDevModal}
            toggleDevModal={toggleDevModal}
            closeDevModal={closeDevModal}
          />
        ) : null}
      </IonContent>
    </IonModal>
  );
};

const DevToolbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showDevModal, setShowDevModal] = useState(null);
  const [isTransluscent, setIsTransluscent] = useState(false);

  const toggleDevModal = name => {
    // console.log("toggleDevModal", showDevModal ? null : name);
    setShowDevModal(name ? name : null);
  };

  const closeDevModal = () => {
    setShowDevModal(null);
    // setIsCollapsed(true);
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          right: 0,
          padding: "10px",
          zIndex: 100,
          ...(isCollapsed && {
            top: "50%",
            background: isTransluscent ? "rgba(240, 65, 65, 0.1)" : "#f04141",
            color: "#FFF"
          }),
          ...(!isCollapsed && {
            top: "30%",
            background: "#FFF",
            border: "1px solid #EEE",
            boxShadow: "3px 3px 3px rgba(0,0,0,.2)"
          })
        }}
      >
        {isCollapsed ? (
          <div
            style={{
              fontSize: "1.5em",
              lineHeight: "1em",
              cursor: "pointer"
            }}
            onClick={() => setIsCollapsed(false)}
          >
            <IonIcon icon={cog} />
          </div>
        ) : (
          <div
            style={{
              width: "200px"
            }}
          >
            <div>
              <h4 className="text-center">Dev Menu</h4>
            </div>
            <IonButton
              className="mb-1"
              color="secondary"
              expand="block"
              onClick={() => {
                setIsTransluscent(!isTransluscent);
                setIsCollapsed(true);
              }}
            >
              Transluscency
            </IonButton>
            <IonButton
              className="mb-1"
              expand="block"
              onClick={() => toggleDevModal("storage")}
            >
              Storage
            </IonButton>
            <IonButton
              className="mb-1"
              expand="block"
              onClick={() => toggleDevModal("notifications")}
            >
              Notifications
            </IonButton>
            <IonButton
              className="mb-1"
              expand="block"
              onClick={() => toggleDevModal("debug")}
            >
              Debug
            </IonButton>
            <IonButton
              expand="block"
              color="dark"
              fill="outline"
              onClick={() => setIsCollapsed(true)}
            >
              Close
            </IonButton>
            <DevModal
              showDevModal={showDevModal}
              toggleDevModal={toggleDevModal}
              closeDevModal={closeDevModal}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DevToolbar;
