import React, { useState, useEffect } from "react";
import _ from "lodash";
import gql from "graphql-tag";
import { useApolloClient } from "@apollo/react-hooks";
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
// import { close, checkmark } from "ionicons/icons";
import { Typography } from "@material-ui/core";
import { Formik, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Loading } from "../Components";

// import UserContext from "../../contexts/UserContext";
// import AuthContext from "../../contexts/AuthContext";
import OnboardContext from "./OnboardContext";
import useReactRouter from "use-react-router";

const FINDJOB_QUERY = gql`
  query FindJobQuery($where: JSON) {
    findJob(where: $where) {
      id
      email
      company {
        id
      }
      branch {
        id
      }
    }
  }
`;

const WorkEmail = ({ ...props }) => {
  const {
    updateUserDetails,
    userDetails,
    getPreviousStepPath,
    // goToPreviousStep,
    currentStepName,
    goToNextStep
  } = OnboardContext.useContainer();
  const { history } = useReactRouter();
  const client = useApolloClient();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const checkWorkEmailSame = async () => {
      const { data } = await client.query({
        query: FINDJOB_QUERY,
        variables: {
          where: {
            branch: _.get(userDetails, "branch"),
            company: _.get(userDetails, "company"),
            email: _.get(userDetails, "email")
          }
        },
        errorPolicy: "all"
      });
      // console.log("data", data);
      if (
        _.get(data, "findJob.id") &&
        _.get(data, "findJob.company.id") === _.get(userDetails, "company") &&
        _.get(data, "findJob.branch.id") === _.get(userDetails, "branch")
      ) {
        updateUserDetails("workEmail", {
          validJob: _.get(data, "findJob"),
          workEmail: _.get(userDetails, "email"),
          workEmailIsPersonalEmail: true
        });
        history.replace("/onboard/review");
      } else {
        updateUserDetails("workEmail", {
          workEmailIsPersonalEmail: false
        });
      }
    };

    if (currentStepName === "workemail" && !pageLoaded) {
      setPageLoaded(true);
      checkWorkEmailSame();
    }
  }, [
    currentStepName,
    pageLoaded,
    userDetails,
    client,
    history,
    updateUserDetails
  ]);

  // Reset pageLoaded if workEmail is reset.
  useEffect(() => {
    if (
      currentStepName !== "workemail" &&
      pageLoaded &&
      (_.get(userDetails, "workEmail") === null ||
        _.get(userDetails, "workEmailIsPersonalEmail") === null)
    ) {
      // console.log("Reset pageLoaded if workEmail is reset.");
      setPageLoaded(false);
    }
  }, [userDetails, pageLoaded, currentStepName]);

  if (
    !pageLoaded ||
    _.get(userDetails, "workEmailIsPersonalEmail") === null ||
    _.get(userDetails, "workEmailIsPersonalEmail")
  ) {
    return (
      <IonPage>
        <IonContent>
          <Loading background="light" />
        </IonContent>
      </IonPage>
    );
  }

  const checkWorkEmail = async (values, { setSubmitting, setFieldError }) => {
    const { data } = await client.query({
      query: FINDJOB_QUERY,
      variables: {
        where: {
          branch: _.get(userDetails, "branch"),
          company: _.get(userDetails, "company"),
          email: _.get(values, "workEmail")
        }
      },
      // fetchPolicy: "network-only",
      errorPolicy: "all"
    });
    setSubmitting(false);

    if (_.get(data, "findJob") === null) {
      setFieldError(
        "workEmail",
        "This email address does not appear in your employer's records."
      );
    } else {
      updateUserDetails("workEmail", {
        validJob: _.get(data, "findJob"),
        workEmail: _.get(values, "workEmail"),
        workEmailIsPersonalEmail: false
      });
      goToNextStep();
    }
  };

  const initialValues = { workEmail: _.get(userDetails, "workEmail") || "" };

  const ValidationSchema = Yup.object().shape({
    workEmail: Yup.string()
      .email("Please enter a valid email address.")
      .required("Required")
  });

  return (
    <IonPage>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        isInitialValid={ValidationSchema.isValidSync(initialValues)}
        validationSchema={ValidationSchema}
        onSubmit={checkWorkEmail}
      >
        {({ handleSubmit, isSubmitting, submitForm, isValid }) => {
          return (
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
                      What email address do you use for <strong>work?</strong>
                    </Typography>
                    <Typography
                      variant="body1"
                      display="block"
                      align="center"
                      className="mb-4"
                    >
                      We need this to confirm your paycheck.
                    </Typography>
                    {/* email */}
                    <Field
                      name="workEmail"
                      label="Work Email address"
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
                          data-cy="onboard-workemail-prev-btn"
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
                          data-cy="onboard-workemail-next-btn"
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
          );
        }}
      </Formik>
    </IonPage>
  );
};

export default WorkEmail;
