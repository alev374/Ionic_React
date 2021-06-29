import React from "react";
import { Typography } from "@material-ui/core";
import { IonPage, IonContent, IonButton } from "@ionic/react";

import styles from "./Misc.module.css";

const SelectLanguage = props => {
  return (
    <IonPage>
      <IonContent>
        <section className={styles["section-blue"]}>
          <div className={styles["middle-position"]}>
            <Typography
              variant="h6"
              display="block"
              align="center"
              className={styles["text-color"]}
            >
              Choose your preferred language
            </Typography>
            <br />
            <br />
            <IonButton
              expand="block"
              size="default"
              color="light"
              fill="outline"
              margin-bottom
              className="height-increase"
            >
              English
            </IonButton>
            <IonButton
              expand="block"
              size="default"
              color="light"
              fill="outline"
              className="height-increase"
            >
              Taglish
            </IonButton>
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default SelectLanguage;
