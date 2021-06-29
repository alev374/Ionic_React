import React from "react";
import { Typography } from "@material-ui/core";
import { IonButton } from "@ionic/react";

import styles from "./Intro.module.css";

const Intro = ({ dismissModal, ...props }) => {
  return (
    <section className={styles["section-blue"]}>
      <div className={styles["middle-position"]}>
        <Typography
          variant="h6"
          display="block"
          align="center"
          className={styles["white"]}
        >
          Now let's set a daily allowance to help keep your spending to a
          minimum.
        </Typography>
        <br />
        <Typography
          variant="h6"
          display="block"
          align="center"
          className={styles["white"]}
        >
          We'll ask you about it at the end of each day.
        </Typography>
        <br />
        <br />
        <IonButton
          expand="block"
          size="default"
          color="light"
          fill="outline"
          onClick={dismissModal}
        >
          Let's do it!
        </IonButton>
      </div>
    </section>
  );
};
export default Intro;
