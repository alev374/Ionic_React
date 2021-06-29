import React from "react";
// import _ from "lodash";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import styles from "./Register.module.css";
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

// import UserContext from "../../../contexts/UserContext";
import AuthContext from "../../../contexts/AuthContext";
import ToastContext from "../../../contexts/ToastContext";

import config from "../../../config";
let serverURI = config.server.serverURI;

const Register = props => {
  const auth = AuthContext.useContainer();
  const { setToast } = ToastContext.useContainer();

  const registerAccount = async (values, { setSubmitting }) => {
    const rawResponse = await fetch(`${serverURI}/auth/local/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phoneNumber: values.phoneNumber,
        password: values.password,
        identifierType: "phoneNumber"
      })
    });
    const content = await rawResponse.json();

    if (content.error) {
      switch (content.statusCode) {
        case 400:
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
      auth.login({
        jwt: content.jwt,
        user: content.user
      });

      analytics.logEvent("sign_up", {
        method: "mobile_app_phonenumber"
      });

      props.history.push(
        `/auth/verify?phoneNumber=${encodeURIComponent(values.phoneNumber)}`
      );
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
    // console.log("showPassword", conditions.showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  return (
    <IonPage>
      <IonContent>
        <Formik
          initialValues={{
            phoneNumber: "",
            password: "",
            confirmPassword: ""
          }}
          validate={values => {
            let errors = {};
            if (!values.password) {
              errors.password = "Please input a password.";
            }

            if (!values.confirmPassword) {
              errors.confirmPassword = "Please input a password.";
            }

            if (values.password !== values.confirmPassword) {
              errors.confirmPassword = "Please make sure your passwords match.";
            }

            if (!values.phoneNumber) {
              errors.phoneNumber = "Please input a phone number.";
            }

            const phoneNumber = parsePhoneNumberFromString(values.phoneNumber);
            if (!phoneNumber.isValid()) {
              errors.phoneNumber = "Please input a valid phone number";
            }

            return errors;
          }}
          onSubmit={registerAccount}
        >
          {({
            values,
            errors,
            touched,
            handleSubmit,
            handleBlur,
            setFieldValue,
            isSubmitting,
            isValid
          }) => (
            <section>
              <form onSubmit={handleSubmit} id={styles["register-form"]}>
                <div id={styles["heading"]}>
                  <Typography
                    variant="h5"
                    display="block"
                    align="center"
                    className="mb-4"
                  >
                    Sign up for NextPay
                  </Typography>
                  <p>
                    Already have an account?{" "}
                    <IonRouterLink href="/auth/login" direction="forward">
                      Sign in
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
                {errors.phoneNumber && touched.phoneNumber ? (
                  <span className="text-danger">
                    Error: {errors.phoneNumber}
                  </span>
                ) : null}

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
                {/* confirm password field */}
                <Field
                  name="confirmPassword"
                  label="Confirm Password"
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
                {/* sign up button */}
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
                      Create account
                    </Typography>
                  )}
                </IonButton>
                <br />
                <Typography
                  variant="body2"
                  display="block"
                  align="center"
                  paragraph
                >
                  By creating an account you agree to our <u>Privacy Policy</u>{" "}
                  and <u>Terms & Conditions</u>.
                </Typography>
              </form>
            </section>
          )}
        </Formik>
      </IonContent>
    </IonPage>
  );
};

export default Register;
