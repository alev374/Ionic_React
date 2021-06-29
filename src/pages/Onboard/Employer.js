import React, { useState, useEffect } from "react";
import _ from "lodash";
import * as Yup from "yup";
import useReactRouter from "use-react-router";

import {
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonButton,
  IonSpinner,
  IonModal,
  IonFooter,
  IonToolbar
} from "@ionic/react";
import { Typography } from "@material-ui/core";
import { Formik } from "formik";
import { TextField as MuiTextField } from "@material-ui/core";
// import { TextField } from "formik-material-ui";

// import UserContext from "../../contexts/UserContext";
// import AuthContext from "../../contexts/AuthContext";
import OnboardContext from "./OnboardContext";
import SearchCompany from "./SearchCompany";
import SearchBranch from "./SearchBranch";

const Employer = ({ ...props }) => {
  const {
    updateUserDetails,
    userDetails,
    currentStepName,
    // goToPreviousStep,
    getPreviousStepPath,
    goToNextStep
  } = OnboardContext.useContainer();
  const {
    history,
    location: { pathname }
  } = useReactRouter();
  // const [errorMessage, setErrorMessage] = useState(null);
  // const auth = AuthContext.useContainer();

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  // console.log("Employer userDetails", userDetails);
  // Restore values from cache if it exists
  useEffect(() => {
    if (currentStepName === "employer") {
      if (_.get(userDetails, "selectedCompany")) {
        setSelectedCompany(_.get(userDetails, "selectedCompany") || null);
      }

      if (_.get(userDetails, "selectedBranch")) {
        setSelectedBranch(_.get(userDetails, "selectedBranch") || null);
      }
    }
  }, [userDetails, currentStepName]);

  /* 
    The following is a hack that solves the issue where the hardware
    back-button does not close the modal.
    In short, we are binding the modals to routes.
  */
  useEffect(() => {
    if (currentStepName === "employer") {
      if (pathname === "/onboard/employer") {
        setShowCompanyModal(false);
        setShowBranchModal(false);
      } else if (pathname === "/onboard/employer/searchcompany") {
        setShowCompanyModal(true);
      } else if (pathname === "/onboard/employer/searchbranch") {
        setShowBranchModal(true);
      }
    }
  }, [pathname, currentStepName]);

  const toggleModal = (type, show) => {
    if (show && type === "company") {
      history.push("/onboard/employer/searchcompany");
    } else if (show && type === "branch") {
      history.push("/onboard/employer/searchbranch");
    } else {
      history.push("/onboard/employer");
    }
  };

  const toggleCompanyModal = show => toggleModal("company", show);
  const toggleBranchModal = show => toggleModal("branch", show);
  /* 
    End of hack.
  */

  const ValidationSchema = Yup.object().shape({
    company: Yup.string().required("Required"),
    branch: Yup.string().required("Required")
  });

  // Already update the onboardingState whenever
  // As the user picks.
  const setSelected = (type, value) => {
    if (type === "company") {
      setSelectedCompany(value);
      updateUserDetails("employer", {
        company: _.get(value, "id"),
        selectedCompany: value,
        workEmail: null,
        workEmailIsPersonalEmail: null
      });
    } else if (type === "branch") {
      setSelectedBranch(value);
      updateUserDetails("employer", {
        branch: _.get(value, "id"),
        selectedBranch: value,
        workEmail: null,
        workEmailIsPersonalEmail: null
      });
    }
  };

  const initialValues = {
    company: _.get(userDetails, "company") || "",
    branch: _.get(userDetails, "branch") || ""
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
          updateUserDetails("employer", {
            ...values,
            selectedCompany,
            selectedBranch
          });
          setSubmitting(false);
        }}
      >
        {({
          handleSubmit,
          isValid,
          isSubmitting,
          setFieldValue,
          submitForm
        }) => (
          <>
            <IonContent>
              <section>
                <>
                  <form onSubmit={handleSubmit}>
                    <Typography
                      variant="h5"
                      display="block"
                      align="center"
                      className="mb-4"
                    >
                      Where do you work?
                    </Typography>
                    {/* Employer */}
                    <MuiTextField
                      name="company"
                      label="Company Name"
                      type="text"
                      value={_.get(selectedCompany, "name") || ""}
                      onClick={() => toggleCompanyModal(true)}
                      onMouseDown={e => e.preventDefault()}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        readOnly: true
                      }}
                    />
                    <IonModal
                      isOpen={showCompanyModal}
                      data-cy="onboard-employer-searchcompany"
                    >
                      <SearchCompany
                        showModal={showCompanyModal}
                        setShowModal={toggleCompanyModal}
                        setFieldValue={setFieldValue}
                        setSelectedCompany={selectedCompany => {
                          setSelected("company", selectedCompany);
                          // Automatically show branch modal if company has more
                          // than one branch.
                          if (_.get(selectedCompany, "branches").length > 1) {
                            console.log("toggleBranchModal? Yeah");
                            toggleBranchModal(true);
                          } else {
                            toggleCompanyModal(false);
                          }
                        }}
                        setSelectedBranch={selectedBranch => {
                          setSelected("branch", selectedBranch);
                        }}
                      />
                    </IonModal>

                    {selectedCompany &&
                    _.get(selectedCompany, "branches").length > 1 ? (
                      <>
                        <MuiTextField
                          name="branch"
                          label="Branch"
                          type="text"
                          value={_.get(selectedBranch, "branchName") || ""}
                          onClick={() => {
                            toggleBranchModal(true);
                          }}
                          onMouseDown={e => e.preventDefault()}
                          margin="normal"
                          variant="outlined"
                          fullWidth
                          InputProps={{
                            readOnly: true
                          }}
                        />
                        <IonModal
                          isOpen={showBranchModal}
                          data-cy="onboard-employer-searchbranch"
                        >
                          <SearchBranch
                            showModal={showBranchModal}
                            setShowModal={toggleBranchModal}
                            setFieldValue={setFieldValue}
                            setSelectedBranch={selectedBranch => {
                              setSelected("branch", selectedBranch);
                            }}
                            selectedCompany={selectedCompany}
                          />
                        </IonModal>
                      </>
                    ) : null}
                  </form>
                </>
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
                        data-cy="onboard-employer-prev-btn"
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
                        className="ml-1 height-increase"
                        data-cy="onboard-employer-next-btn"
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

export default Employer;
