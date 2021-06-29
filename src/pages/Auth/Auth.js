import React from "react";
// import _ from "lodash";
import { Route } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";

import Login from "./Login/Login";
import Register from "./Register/Register";
import Verify from "./Verify/Verify";
import ResetPasswordSuccess from "./ResetPassword/ResetPasswordSuccess";
import EnterPin from "./PinCode/EnterPin";
import SetupPin from "./PinCode/SetupPin";
import SetupPinComplete from "./PinCode/SetupPinComplete";

const Auth = () => {
  return (
    <IonRouterOutlet>
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route path="/auth/verify" component={Verify} />
      <Route path="/auth/pin/enter" component={EnterPin} />
      <Route path="/auth/pin/setup" component={SetupPin} />
      <Route path="/auth/pin/setup-complete" component={SetupPinComplete} />
      <Route
        path="/auth/resetpassword/success"
        component={ResetPasswordSuccess}
      />
    </IonRouterOutlet>
  );
};

export default Auth;
