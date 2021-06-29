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
  IonFooter,
  IonToolbar
} from "@ionic/react";
import { Typography } from "@material-ui/core";
import { Formik, Field } from "formik";
import { TextField } from "formik-material-ui";

// import UserContext from "../../contexts/UserContext";
// import AuthContext from "../../contexts/AuthContext";
import OnboardContext from "./OnboardContext";

const Email = ({ ...props }) => {
  const {
    updateUserDetails,
    userDetails,
    getPreviousStepPath,
    // goToPreviousStep,
    goToNextStep
  } = OnboardContext.useContainer();
  // const [errorMessage, setErrorMessage] = useState(null);
  // const auth = AuthContext.useContainer();

  const ValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Required")
  });

  const initialValues = { email: _.get(userDetails, "email") || "" };

  return (
    <IonPage>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        isInitialValid={ValidationSchema.isValidSync(initialValues)}
        validationSchema={ValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          goToNextStep();
          updateUserDetails("email", {
            ...values,
            workEmailIsPersonalEmail: null
          });
          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          isSubmitting,
          submitForm
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
                    What's your email address?
                  </Typography>
                  {/* email */}
                  <Field
                    name="email"
                    label="Email address"
                    type="email"
                    component={TextField}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                  />
                </form>
              </section>
            </IonContent>
            <IonFooter>
              <IonToolbar>
                <IonGrid>
                  <IonRow className="px-3 pb-2">
                    <IonCol>
                      {/* Next */}
                      <IonButton
                        expand="block"
                        size="default"
                        color="primary"
                        fill="outline"
                        // onClick={goToPreviousStep}
                        href={getPreviousStepPath()}
                        routerDirection="back"
                        className="mr-1 height-increase"
                        data-cy="onboard-email-prev-btn"
                      >
                        Back
                      </IonButton>
                    </IonCol>
                    <IonCol>
                      {/* Next */}
                      <IonButton
                        expand="block"
                        size="default"
                        color="primary"
                        disabled={isSubmitting || !isValid}
                        onClick={submitForm}
                        data-cy="onboard-email-next-btn"
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

export default Email;
