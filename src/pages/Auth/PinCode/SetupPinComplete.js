import React from "react";
import { IonPage, IonContent, IonRouterLink, IonButton } from "@ionic/react";
import { Typography } from "@material-ui/core";
import { CheckCircleOutline } from "@material-ui/icons";
import styles from "./PinCode.module.css";

const SetupPinComplete = props => {
  return (
    <IonPage>
      <IonContent>
        <section className={styles["section-white"]}>
          <div className={styles["middle-position"]}>
            <Typography variant="h3" display="block" align="center">
              <CheckCircleOutline className={styles["checkmark"]} />
            </Typography>
            <Typography variant="h6" display="block" align="center">
              PIN successfully set
            </Typography>
            <br />
            <Typography variant="body2" display="block" align="center">
              You have successfully set your PIN. Use your new PIN when signing
              in.
            </Typography>
            <br />
            <IonRouterLink href="/" direction="forward">
              <IonButton
                expand="block"
                size="default"
                className="height-increase"
                data-cy="setup-pin-complete-btn"
              >
                Continue
              </IonButton>
            </IonRouterLink>
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default SetupPinComplete;
