import React from "react";
import { IonSpinner } from "@ionic/react";

import styles from "./Loading.module.css";

const Loading = ({ background }) => {
  return (
    <section className={background !== "light" ? styles["section-blue"] : ""}>
      <div className={styles["middle-position"]}>
        <IonSpinner
          color={background !== "light" ? "light" : "primary"}
          style={{ margin: "0px auto" }}
        />
      </div>
    </section>
  );
};

export default Loading;
