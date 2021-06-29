import React from "react";
import { IonPage, IonContent, IonRouterLink, IonButton } from "@ionic/react";
import { Typography } from "@material-ui/core";
import { CheckCircleOutline } from "@material-ui/icons";
import styles from "./ResetPassword.module.css";

const ResetPasswordSuccess = props => {
  return (
    <IonPage>
      <IonContent>
        <section className={styles["section-white"]}>
          <div className={styles["middle-position"]}>
            <Typography variant="h3" display="block" align="center">
              <CheckCircleOutline className={styles["checkmark"]} />
            </Typography>
            <Typography variant="h6" display="block" align="center">
              You've reset your password
            </Typography>
            <br />
            <Typography variant="body2" display="block" align="center">
              You have successfully reset your password. Use your new password
              when signing in.
            </Typography>
            <br />
            <IonRouterLink href="/auth/login" direction="forward">
              <IonButton
                expand="block"
                size="default"
                className="height-increase"
              >
                Sign in
              </IonButton>
            </IonRouterLink>
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default ResetPasswordSuccess;
