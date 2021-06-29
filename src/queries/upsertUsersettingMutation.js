import gql from "graphql-tag";
import {
  USER_SETTING_QUERY,
  INITIAL_USERSETTINGS_QUERY /* USER_SETTINGS_QUERY */
} from "./usersettingsQueries";
import _ from "lodash";

export const UPSERT_USERSETTING_MUTATION = gql`
  mutation upsertUsersetting($input: upsertUsersettingInput) {
    upsertUsersetting(input: $input) {
      usersetting {
        id
        name
        value
        offlineAccess
        user {
          id
        }
      }
    }
  }
`;

const UpsertUsersettingMutation = () => {
  const optimisticResponse = ({ client, newValues }) => {
    // If
    if (!newValues.id) {
      return false;
    }
    // console.log("newValues", newValues);

    // const cacheData = client.readQuery({
    //   query: INITIAL_USERSETTINGS_QUERY,
    //   variables: {
    //     where: {
    //       user: newValues.user.id
    //     }
    //   }
    // });

    // console.log("cacheData", cacheData);

    // const cacheUsersetting = _.find(cacheData.usersettings, {
    //   id: newValues.id
    // });

    const cacheUsersetting = client.readFragment({
      id: `Usersetting:${newValues.id}`,
      fragment: gql`
        fragment Usersetting on Usersettings {
          id
          name
          value
          offlineAccess
          user {
            id
          }
        }
      `
    });

    // console.log("cacheUserSetting", cacheUsersetting);
    // console.log("Optimistic Response", {
    //   __typename: "Usersetting",
    //   ...cacheUsersetting,
    //   ...newValues
    // });

    return {
      __typename: "Mutation",
      upsertUsersetting: {
        __typename: "upsertUsersettingPayload",
        usersetting: {
          __typename: "Usersetting",
          ...cacheUsersetting,
          ...newValues
        }
      }
    };
  };

  const update = (cache, { data }) => {
    // console.log("update() ran on", data);
    const upsertedUsersetting = _.get(data, "upsertUsersetting.usersetting");

    /* 
      Update usersettings LIST cache
    */
    const cacheData = cache.readQuery({
      query: INITIAL_USERSETTINGS_QUERY,
      variables: {
        where: {
          user: _.get(upsertedUsersetting, "user.id")
        }
      }
    });

    // console.log("cacheData", cacheData);

    const usersettings = _.get(cacheData, "usersettings");
    // Find item index using _.findIndex (thanks @AJ Richardson for comment)
    const index = _.findIndex(usersettings, {
      name: _.get(upsertedUsersetting, "name")
    });

    if (index > -1) {
      usersettings.splice(index, 1, upsertedUsersetting);
    } else {
      usersettings.push(upsertedUsersetting);
    }

    cache.writeQuery({
      query: INITIAL_USERSETTINGS_QUERY,
      variables: {
        where: {
          user: _.get(upsertedUsersetting, "user.id")
        }
      },
      data: {
        ...cacheData,
        usersettings
      }
    });

    /* 
      Update usersettings ITEM cache
    */

    const cacheUsersetting = cache.readFragment({
      id: `Usersetting:${_.get(upsertedUsersetting, "id")}`,
      fragment: gql`
        fragment Usersetting on Usersettings {
          id
          name
          value
          offlineAccess
          user {
            id
          }
        }
      `
    });

    // console.log("update cacheUsersetting", cacheUsersetting);

    if (!cacheUsersetting) {
      return;
    }

    cache.writeQuery({
      query: USER_SETTING_QUERY,
      variables: {
        id: _.get(upsertedUsersetting, "id")
      },
      data: {
        usersetting: {
          ...cacheUsersetting,
          ...upsertedUsersetting
        }
      }
    });
  };

  const context = {
    serializationKey: "MUTATION",
    tracked: true
  };

  return {
    mutationName: "upsertUsersetting",
    mutation: UPSERT_USERSETTING_MUTATION,
    update,
    optimisticResponse,
    context
  };
};

export default UpsertUsersettingMutation;
