import gql from "graphql-tag";
import { USER_QUERY, USER_QUERY_FRAGMENT } from "./userQuery";
import _ from "lodash";

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($input: updateUserInput) {
    updateUser(input: $input) {
      user {
        id
        firstName
        middleName
        lastName
        phoneNumber
        email
        birthdate
        dependentsCount
        gender
        maritalStatus
        pinSecret
      }
    }
  }
`;

const UpdateUserMutation = () => {
  const optimisticResponse = ({ client, newValues }) => {
    // const cacheData = client.readQuery({
    //   query: USER_QUERY,
    //   variables: {
    //     id: newValues.id
    //   }
    // });

    const cacheUser = client.readFragment({
      id: `UsersPermissionsUser:${newValues.id}`,
      fragment: USER_QUERY_FRAGMENT
    });

    // console.log("cacheData optimistic", cacheData);
    return {
      __typename: "Mutation",
      updateUser: {
        __typename: "updateUserPayload",
        user: {
          __typename: "UsersPermissionsUser",
          ...cacheUser,
          ...newValues
        }
      }
    };
  };

  const update = (cache, { data }) => {
    // console.log("update() ran on", data);

    const userId = _.get(data, "updateUser.user.id");

    // const cacheData = cache.readQuery({
    //   query: USER_QUERY,
    //   variables: {
    //     id: userId
    //   }
    // });

    // if (!_.get(cacheData, "user")) {
    //   return;
    // }

    const cacheUser = cache.readFragment({
      id: `UsersPermissionsUser:${userId}`,
      fragment: USER_QUERY_FRAGMENT
    });

    // console.log("cacheData", cacheData);

    cache.writeQuery({
      query: USER_QUERY,
      variables: {
        id: userId
      },
      data: {
        user: {
          ...cacheUser,
          ..._.get(data, "updateUser.user")
        }
      }
    });
  };

  const context = {
    serializationKey: "MUTATION",
    tracked: true
  };

  return {
    mutationName: "updateUser",
    mutation: UPDATE_USER_MUTATION,
    update,
    optimisticResponse,
    context
  };
};

export default UpdateUserMutation;
