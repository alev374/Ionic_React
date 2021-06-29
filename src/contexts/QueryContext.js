import { useRef } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { createContainer } from "unstated-next";
import { network } from "../services";
import ToastContext from "./ToastContext";

import updateUserMutation from "../queries/updateUserMutation";
import upsertUsersettingMutation from "../queries/upsertUsersettingMutation";
import requestJobverification from "../queries/requestJobverification";
// import useUserQuery from "../queries/userQuery";

const mutationHooks = [
  updateUserMutation,
  upsertUsersettingMutation,
  requestJobverification
];

const useQueryContext = () => {
  const { setToast } = ToastContext.useContainer();
  const client = useApolloClient();
  const mutations = useRef({});
  const updateHandlerByName = useRef({});

  mutationHooks.forEach(mutationHook => {
    const {
      mutationName,
      mutation,
      update = null,
      optimisticResponse: defaultOptimisticResponse = null,
      context
    } = mutationHook();
    mutations.current = {
      ...mutations.current,
      [mutationName]: async (
        options,
        {
          optimisticResponse: providedOptimisticResponse,
          newValues,
          onlineOnly
        }
      ) => {
        if (onlineOnly && !network.online) {
          setToast({
            color: "dark",
            message: "You are currently offline."
          });
          return false;
        }

        let optimisticResponse = defaultOptimisticResponse
          ? defaultOptimisticResponse({
              newValues,
              client
            })
          : null;
        if (providedOptimisticResponse) {
          optimisticResponse = providedOptimisticResponse;
        }

        // console.log("mutation", mutation);
        return await client.mutate({
          mutation,
          update,
          ...(optimisticResponse && {
            optimisticResponse
          }),
          context,
          ...options
        });
      }
    };

    updateHandlerByName.current = {
      ...updateHandlerByName.current,
      [mutationName]: update
    };
  });

  return {
    mutations: mutations.current,
    updateHandlerByName: updateHandlerByName.current
  };
};

// export default useQueryContext;
export default createContainer(useQueryContext);
