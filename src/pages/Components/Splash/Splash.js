import React from "react";
import { Typography } from "@material-ui/core";
import { IonPage, IonContent } from "@ionic/react";

import styles from "./Splash.module.css";

const Splash = () => {
  return (
    <IonPage>
      <IonContent>
        <section className={styles["section-blue"]}>
          <div className={styles["middle-position"]}>
            <Typography
              variant="h2"
              display="block"
              align="center"
              fontWeight={600}
              className="text-light"
            >
              NextPay
            </Typography>
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Splash;
