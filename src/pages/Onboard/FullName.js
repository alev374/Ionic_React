import React from "react";
import _ from "lodash";
import * as Yup from "yup";

import {
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonButton,
  IonSpinner,
  IonToolbar,
  IonFooter
} from "@ionic/react";
import { Typography, InputAdornment } from "@material-ui/core";
import { Formik, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Check } from "@material-ui/icons";

import UserContext from "../../contexts/UserContext";
// import AuthContext from "../../contexts/AuthContext";
import OnboardContext from "./OnboardContext";

const FullName = ({ ...props }) => {
  const { user } = UserContext.useContainer();
  const {
    updateUserDetails,
    getPreviousStepPath,
    goToNextStep,
    onboardState
  } = OnboardContext.useContainer();

  // console.log("user", user);

  // const [errorMessage, setErrorMessage] = useState(null);

  // console.log("onboardState", onboardState);
  // console.log("userDetails", userDetails);

  const ValidationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Please enter a name."),
    middleName: Yup.string().max(50, "Too Long!"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Please enter a name.")
  });

  const initialValues = {
    firstName: _.get(user, "firstName") || "",
    lastName: _.get(user, "lastName") || "",
    middleName: _.get(user, "middleName") || ""
  };

  return (
    <IonPage>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        isInitialValid={ValidationSchema.isValidSync(initialValues)}
        validationSchema={ValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          goToNextStep();
          updateUserDetails("fullname", values);
          setSubmitting(false);
        }}
      >
        {({
          handleSubmit,
          isSubmitting,
          isValid,
          submitForm,
          errors,
          touched
        }) => (
          <>
            <IonContent>
              <section>
                <form onSubmit={handleSubmit}>
                  <Typography
                    variant="h5"
                    display="block"
                    align="center"
                    className="mb-4"
                  >
                    What's your name?
                  </Typography>
                  {/* firstName */}
                  <Field
                    name="firstName"
                    label="First Name"
                    type="text"
                    component={TextField}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...(!errors.firstName &&
                        touched.firstName && {
                          endAdornment: (
                            <InputAdornment position="end">
                              <Check />
                            </InputAdornment>
                          )
                        })
                    }}
                  />

                  {/* middleName */}
                  <Field
                    name="middleName"
                    label="Middle Name (Optional)"
                    type="text"
                    component={TextField}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                  />

                  {/* lastName */}
                  <Field
                    name="lastName"
                    label="Last Name"
                    type="text"
                    component={TextField}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...(!errors.lastName &&
                        touched.lastName && {
                          endAdornment: (
                            <InputAdornment position="end">
                              <Check />
                            </InputAdornment>
                          )
                        })
                    }}
                  />
                </form>
              </section>
            </IonContent>
            <IonFooter>
              <IonToolbar>
                <IonGrid>
                  <IonRow className="justify-content-between px-3 pb-2">
                    <IonCol align-self-stretch>
                      {/* Back */}
                      {onboardState === "review" ? (
                        <IonButton
                          expand="block"
                          size="default"
                          color="primary"
                          fill="outline"
                          // onClick={goToPreviousStep}
                          href={getPreviousStepPath()}
                          routerDirection="back"
                          className="mr-1 height-increase"
                          data-cy="onboard-fullname-prev-btn"
                        >
                          Back
                        </IonButton>
                      ) : null}
                    </IonCol>
                    <IonCol>
                      {/* Next */}
                      <IonButton
                        expand="block"
                        size="default"
                        color="primary"
                        disabled={isSubmitting || !isValid}
                        onClick={submitForm}
                        data-cy="onboard-fullname-next-btn"
                        className="ml-1 height-increase"
                      >
                        {isSubmitting ? <IonSpinner /> : <span>Next</span>}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonToolbar>
            </IonFooter>
          </>
        )}
      </Formik>
    </IonPage>
  );
};

export default FullName;
