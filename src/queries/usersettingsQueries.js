import gql from "graphql-tag";

export const INITIAL_USERSETTINGS_QUERY = gql`
  query InitialUsersettingsQuery(
    $where: JSON
    $limit: Int
    $start: Int
    $sort: String
  ) {
    getDefaultUsersettings
    usersettings(where: $where, limit: $limit, start: $start, sort: $sort) {
      id
      name
      value
      offlineAccess
    }
  }
`;

export const GET_DEFAULT_USERSETTINGS_QUERY = gql`
  query GetDefaultUsersettingsQuery {
    getDefaultUsersettings
  }
`;

export const USER_SETTINGS_QUERY = gql`
  query UserSettings($where: JSON, $limit: Int, $start: Int, $sort: String) {
    usersettings(where: $where, limit: $limit, start: $start, sort: $sort) {
      id
      name
      value
      offlineAccess
    }
  }
`;

export const USER_SETTING_QUERY = gql`
  query Usersetting($id: ID!) {
    usersetting(id: $id) {
      id
      name
      value
      offlineAccess
    }
  }
`;
