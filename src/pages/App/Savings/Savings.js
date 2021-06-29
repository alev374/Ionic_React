import React, { useState } from "react";
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton
} from "@ionic/react";
import { Typography, Popover } from "@material-ui/core";
import { Edit, MoreVert, CompareArrows } from "@material-ui/icons";
import styles from "./Savings.module.css";

const logs = [
  {
    name: "NextPay Autosavings",
    date: "June 30",
    amount: "2,288.23",
    isGreen: true
  },

  {
    name: "NextPay Autosavings",
    date: "June 15",
    amount: "2,288.23",
    isGreen: true
  },

  {
    name: "Transfer to Payroll",
    date: "June 12",
    amount: "450.00",
    isGreen: false
  },

  {
    name: "Birthday",
    date: "November 15",
    amount: "1000.00",
    isGreen: true
  }
];

const ActivityLog = props => {
  return (
    <div className="p-3 border-bottom">
      <Typography
        variant="caption"
        display="block"
        className="text-black-50 text-uppercase"
      >
        {props.date}
      </Typography>
      <div className="d-flex justify-content-between align-items-center">
        <Typography variant="body1" display="block">
          {props.name}
        </Typography>
        <Typography
          variant="body2"
          display="block"
          className={props.isGreen ? "text-success" : "text-danger"}
        >
          {props.isGreen ? "+" : "-"}₱{props.amount}
        </Typography>
      </div>
    </div>
  );
};

const Emoji = props => (
  <span
    role="img"
    aria-label={props.label ? props.label : ""}
    aria-hidden={props.label ? "false" : "true"}
  >
    {props.symbol}
  </span>
);

const Savings = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);
  const id = isOpen ? "simple-popover" : undefined;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>NextPay Savings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className={styles["savings-container"]}>
          <div className={styles["blue-container"]}></div>
          <IonCard className="bg-light">
            <IonCardHeader>
              <MoreVert
                id={styles["more"]}
                className="mr-2"
                aria-describedby={id}
                onClick={handleClick}
              />

              <Popover
                id={id}
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center"
                }}
              >
                <div className="px-3 py-2">
                  <div className="d-flex justify-content-start align-items-center">
                    <CompareArrows className="text-black-50 mr-2" />
                    <Typography
                      variant="body2"
                      display="block"
                      align="center"
                      className="font-weight-bold text-black-50"
                    >
                      Withdraw money
                    </Typography>
                  </div>
                </div>
              </Popover>
              <IonCardSubtitle className="text-center text-dark">
                <Emoji symbol="💰" label="money" />
                Your savings with us so far!
                <Emoji symbol="💰" label="money" />
              </IonCardSubtitle>
              <IonCardTitle>
                <Typography
                  variant="h3"
                  display="block"
                  align="center"
                  className="font-weight-bold text-black-50"
                  id={styles["savings-number"]}
                >
                  <span id={styles["currency"]} className="align-top mr-2">
                    ₱
                  </span>
                  6,245.56
                </Typography>
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <Typography variant="body1" display="block" align="center">
                You'll save about ₱2000.00 in 3 days!
              </Typography>
              <IonButton
                expand="block"
                size="full"
                fill="clear"
                className="height-increase text-center"
              >
                <Edit className="mr-2" fontSize="small" /> Edit Smart Save
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
        <section className="my-4">
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <Typography variant="h6" display="block" className="text-black-50">
              Latest activity
            </Typography>
            <Typography
              variant="button"
              display="block"
              className="text-primary"
            >
              View all
            </Typography>
          </div>
          <div className="shadow-sm rounded overflow-hidden border">
            {logs.map((x, index) => {
              return (
                <ActivityLog
                  name={x.name}
                  amount={x.amount}
                  isGreen={x.isGreen}
                  date={x.date}
                  key={index}
                />
              );
            })}
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Savings;
