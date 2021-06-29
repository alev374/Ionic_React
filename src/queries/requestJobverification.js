import gql from "graphql-tag";
import { USER_QUERY, USER_QUERY_FRAGMENT } from "./userQuery";
import _ from "lodash";

export const REQUEST_JOB_VERIFICATION_MUTATION = gql`
  mutation requestJobverification($job: ID!, $user: ID!) {
    requestJobverification(job: $job, user: $user) {
      id
      isActive
      user {
        id
      }
    }
  }
`;

const RequestJobverificationMutation = () => {
  const update = (cache, { data }) => {
    // console.log("update() ran on", data);
    const jobverification = _.get(data, "requestJobverification");

    const userId = _.get(jobverification, "user.id");

    const cacheUser = cache.readFragment({
      id: `UsersPermissionsUser:${userId}`,
      fragment: USER_QUERY_FRAGMENT
    });

    // console.log("cacheData", cacheData);

    const jobverifications = _.get(cacheUser, "jobverifications");
    jobverifications.push(jobverification);

    cache.writeQuery({
      query: USER_QUERY,
      variables: {
        id: userId
      },
      data: {
        user: {
          ...cacheUser,
          jobverifications
        }
      }
    });
  };

  const context = {
    serializationKey: "MUTATION",
    tracked: true
  };

  return {
    mutationName: "requestJobverification",
    mutation: REQUEST_JOB_VERIFICATION_MUTATION,
    update,
    optimisticResponse: null,
    context
  };
};

export default RequestJobverificationMutation;
