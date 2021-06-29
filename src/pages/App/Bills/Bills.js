import React from "react";
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent
} from "@ionic/react";

const DailyBudget = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Bills</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <section>Coming Soon</section>
      </IonContent>
    </IonPage>
  );
};

export default DailyBudget;
