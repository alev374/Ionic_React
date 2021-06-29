import React from "react";
import _ from "lodash";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import styles from "./Login.module.css";
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonRouterLink,
  IonButton
} from "@ionic/react";
import { Typography, InputAdornment, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Formik, Field } from "formik";
import { TextField } from "formik-material-ui";
import { PhoneNumberInput } from "../../Components";
import { analytics } from "../../../services";

// import UserContext from "../../contexts/UserContext";
import AuthContext from "../../../contexts/AuthContext";
import ToastContext from "../../../contexts/ToastContext";
import AppContext from "../../../contexts/AppContext";

import config from "../../../config";
let serverURI = config.server.serverURI;

const Login = props => {
  const auth = AuthContext.useContainer();
  const { setToast } = ToastContext.useContainer();
  const { setPinCodeFromSecret } = AppContext.useContainer();

  const login = async (values, { setSubmitting }) => {
    const rawResponse = await fetch(`${serverURI}/auth/local`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        identifier: values.phoneNumber,
        password: values.password,
        identifierType: "phoneNumber"
      })
    });
    const content = await rawResponse.json();

    if (content.error) {
      switch (content.statusCode) {
        case 400:
          console.log("seterrormessage");
          setToast({
            message: "The phone number or password is invalid.",
            color: "danger"
          });
          break;
        default:
          setToast({
            message: "The phone number or password is invalid.",
            color: "danger"
          });
          break;
      }
    } else {
      console.log("content.user", content.user);
      await auth.login({
        jwt: content.jwt,
        user: content.user
      });

      // Log analytics
      analytics.logEvent("login", {
        method: "mobile_app_phonenumber"
      });

      // If user isn't confirmed, require them to verify their number
      if (_.get(content, "user.confirmed") !== true) {
        props.history.push(
          `/auth/verify?phoneNumber=${encodeURIComponent(values.phoneNumber)}`
        );
      } else {
        props.history.push("/");
      }

      // If user has set up their PIN before, then we can use it
      if (!_.isEmpty(_.get(content, "user.pinSecret"))) {
        setPinCodeFromSecret(_.get(content, "user.pinSecret"));
      }
    }
    setSubmitting(false);
  };

  const [conditions, setConditions] = React.useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false
  });

  const handleClickShowPassword = () => {
    setConditions({ ...conditions, showPassword: !conditions.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  return (
    <IonPage>
      <IonContent>
        <Formik
          initialValues={{ phoneNumber: "", password: "" }}
          validate={values => {
            let errors = {};
            if (!values.password) {
              errors.password = "Please input a password.";
            }

            if (!values.phoneNumber) {
              errors.phoneNumber = "Please input a phone number.";
            }

            const phoneNumber = parsePhoneNumberFromString(values.phoneNumber);
            if (!phoneNumber.isValid()) {
              errors.phoneNumber = "The phone number is invalid.";
            }
            return errors;
          }}
          onSubmit={login}
        >
          {({
            values,
            errors,
            isValid,
            handleSubmit,
            handleBlur,
            isSubmitting,
            setFieldValue
          }) => (
            <section>
              <form onSubmit={handleSubmit} id={styles["login-form"]}>
                <div id={styles["heading"]}>
                  <Typography
                    variant="h5"
                    display="block"
                    align="center"
                    className="mb-4"
                  >
                    Sign In to NextPay
                  </Typography>
                  <p>
                    Don't have an account?{" "}
                    <IonRouterLink href="/auth/register" direction="back">
                      Sign up
                    </IonRouterLink>
                    .
                  </p>
                </div>
                {/* mobile number field */}
                <PhoneNumberInput
                  name="phoneNumber"
                  label="Phone Number"
                  type="text"
                  value={values.phoneNumber}
                  disabled={isSubmitting}
                  onChange={value => {
                    setFieldValue("phoneNumber", value);
                  }}
                  onBlur={handleBlur}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                />

                {/* password field */}
                <Field
                  name="password"
                  label="Password"
                  type={conditions.showPassword ? "text" : "password"}
                  component={TextField}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {conditions.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {/* sign in button */}
                <IonButton
                  expand="block"
                  size="default"
                  color="primary"
                  disabled={isSubmitting || !isValid}
                  type="submit"
                  data-cy="submit-btn"
                  className="my-3 height-increase"
                >
                  {isSubmitting ? (
                    <IonSpinner />
                  ) : (
                    <Typography variant="button" display="block" align="center">
                      Sign In
                    </Typography>
                  )}
                </IonButton>
                <a href="/" id={styles["forgot"]}>
                  <Typography
                    variant="body1"
                    display="block"
                    align="center"
                    paragraph
                  >
                    I forgot my password
                  </Typography>
                </a>
              </form>
            </section>
          )}
        </Formik>
      </IonContent>
    </IonPage>
  );
};

export default Login;
