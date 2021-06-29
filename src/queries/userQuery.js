import gql from "graphql-tag";

export const USER_QUERY_FRAGMENT = gql`
  fragment User on UsersPermissionsUser {
    id
    firstName
    middleName
    lastName
    phoneNumber
    email
    confirmed
    birthdate
    dependentsCount
    gender
    maritalStatus
    pinSecret
    address {
      addressline1
      addressline2
      city
      stateOrProvince
      postalcode
      unit
      country
    }
    usersettings {
      id
      name
      value
    }
    jobverifications(where: { isActive: true }) {
      id
      isActive
    }
  }
`;

export const USER_QUERY = gql`
  query CurrentUser($id: ID!) {
    user(id: $id) {
      ...User
    }
  }
  ${USER_QUERY_FRAGMENT}
`;
