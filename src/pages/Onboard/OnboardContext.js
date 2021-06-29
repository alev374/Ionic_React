import { useState, useEffect, useCallback } from "react";
// import gql from "graphql-tag";
import _ from "lodash";
import { createContainer } from "unstated-next";
import useReactRouter from "use-react-router";

import { storage, analytics } from "../../services";
import UserContext from "../../contexts/UserContext";
import UsersettingsContext from "../../contexts/UsersettingsContext";
import QueryContext from "../../contexts/QueryContext";

import FullName from "./FullName";
import Email from "./Email";
import Employer from "./Employer";
import WorkEmail from "./WorkEmail";
import Review from "./Review";

export const steps = [
  {
    name: "fullname",
    progress: 0.2,
    component: FullName,
    path: "/onboard/fullname"
  },
  {
    name: "email",
    progress: 0.4,
    component: Email,
    path: "/onboard/email"
  },
  {
    name: "employer",
    progress: 0.6,
    component: Employer,
    path: "/onboard/employer"
  },
  {
    name: "workemail",
    progress: 0.8,
    component: WorkEmail,
    path: "/onboard/workemail"
  },
  {
    name: "review",
    progress: 1,
    component: Review,
    path: "/onboard/review"
  }
];

const useOnboardHelper = props => {
  const { user } = UserContext.useContainer();
  const {
    getUsersettings,
    setUsersetting
  } = UsersettingsContext.useContainer();
  const { mutations } = QueryContext.useContainer();
  const { onboardState } = getUsersettings(["onboardState"]);
  // console.log("useOnboardHelper user", user);
  const {
    history,
    location: { pathname }
  } = useReactRouter();

  const [userDetails, setUserDetails] = useState(null);
  const [currentStepName, setCurrentStepName] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [stepProgress, setStepProgress] = useState(0.25);

  // Pull userDetails from storage if it exists on first load.
  useEffect(() => {
    const onboard = storage.getItem("onboard");
    if (onboard) {
      // console.log("onboard taken from storage", onboard);
      const { userDetails: prevUserDetails } = onboard;
      setUserDetails(prevUserDetails);
    }
  }, []);

  useEffect(() => {
    let stepIndex = _.findIndex(steps, step => {
      if (step.path === pathname) {
        return true;
      } else if (_.includes(pathname, step.path)) {
        return true;
      } else {
        return false;
      }
    });

    stepIndex = stepIndex > -1 ? stepIndex : 0;
    setCurrentStepName(steps[stepIndex].name);
    setCurrentStep(stepIndex);
  }, [pathname]);

  // Sync data with what's on the server
  useEffect(() => {
    const syncWithRemote = async () => {
      // console.log("user", user);
      const remoteUserDetails = _.pick(user, [
        "firstName",
        "middleName",
        "lastName",
        "email"
      ]);
      setUserDetails(prevUserDetails => {
        return {
          ...remoteUserDetails,
          ...prevUserDetails
        };
      });
      const prevOnboard = storage.getItem("onboard");
      storage.setItem(
        "onboard",
        _.merge(prevOnboard, {
          userDetails: {
            ...remoteUserDetails
          }
        })
      );
    };
    syncWithRemote();
  }, [user]);

  useEffect(() => {
    const checkCurrentStep = async () => {
      if (currentStep || currentStep === 0) {
        const { name, progress } = steps[currentStep];
        setStepProgress(progress);
        setCurrentStepName(name);

        if (name === "review" && onboardState !== "review") {
          setUsersetting("onboardState", "review");
          analytics.logEvent("onboarding_review");
        } else if (onboardState === null) {
          setUsersetting("onboardState", "begin");
          analytics.logEvent("onboarding_begin");
        }
      }
    };
    checkCurrentStep();
  }, [currentStep, setUsersetting, onboardState]);

  const updateUserDetails = useCallback(
    async (step, newUserDetails) => {
      // console.log("newUserDetails", newUserDetails);
      setUserDetails(prevUserDetails => {
        return {
          ...prevUserDetails,
          ...newUserDetails
        };
      });

      const prevOnboard = storage.getItem("onboard");
      storage.setItem(
        "onboard",
        _.merge(prevOnboard, {
          userDetails: {
            ...newUserDetails
          }
        })
      );

      if (step === "fullname" || step === "email") {
        mutations.updateUser(
          {
            variables: {
              input: {
                where: {
                  id: user.id
                },
                data: _.pick(newUserDetails, [
                  "email",
                  "firstName",
                  "middleName",
                  "lastName"
                ])
              }
            }
          },
          {
            newValues: {
              id: user.id,
              ..._.pick(newUserDetails, [
                "email",
                "firstName",
                "middleName",
                "lastName"
              ])
            }
          }
        );
      }
    },
    [user, mutations]
  );

  const goToPreviousStep = () => {
    const prevStep = currentStep > 0 ? currentStep - 1 : currentStep;
    const { path } = steps[prevStep];
    history.push(path);
    // setCurrentStep(prevStep);
  };

  const getPreviousStepPath = () => {
    const prevStep = currentStep > 0 ? currentStep - 1 : steps.length - 1;
    const { path } = steps[prevStep];
    return path;
  };

  const goToNextStep = () => {
    const nextStep =
      currentStep < steps.length - 1 ? currentStep + 1 : currentStep;
    const { path } = steps[nextStep];
    history.push(path);
    // setCurrentStep(nextStep);
  };

  const completeOnboarding = useCallback(() => {
    // console.log("UserDeetails", userDetails);
    if (onboardState !== "complete") {
      setUsersetting("onboardState", "complete");
      analytics.logEvent("onboarding_complete");
      mutations.requestJobverification(
        {
          variables: {
            job: _.get(userDetails, "validJob.id"),
            user: _.get(user, "id")
          }
        },
        {
          newValues: {
            isActive: true,
            user: user
          }
        }
      );
    }
  }, [setUsersetting, onboardState, userDetails, mutations, user]);

  return {
    userDetails,
    updateUserDetails,
    goToPreviousStep,
    goToNextStep,
    getPreviousStepPath,
    currentStepName,
    currentStep,
    stepProgress,
    onboardState,
    completeOnboarding
  };
};

export default createContainer(useOnboardHelper);
