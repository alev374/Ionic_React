import React from "react";
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent
} from "@ionic/react";

const Activity = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Activity</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <section>Coming Soon</section>
      </IonContent>
    </IonPage>
  );
};

export default Activity;
