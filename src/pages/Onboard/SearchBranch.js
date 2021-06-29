import React, { useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import _ from "lodash";

import {
  IonContent,
  IonButton,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonSearchbar,
  IonList,
  IonListHeader,
  IonItem,
  IonSkeletonText,
  IonLabel
} from "@ionic/react";

const SELECT_LIST_QUERY = gql`
  query BranchSelectListQuery(
    $limit: Int
    $start: Int
    $sort: String
    $where: JSON
  ) {
    branches(limit: $limit, start: $start, sort: $sort, where: $where) {
      id
      branchName
      address {
        addressline1
        addressline2
        city
        stateOrProvince
        unit
      }
    }
  }
`;

const SearchEmployer = ({
  showModal,
  setShowModal,
  setFieldValue,
  setSelectedBranch,
  selectedCompany,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState("");
  const { data, loading } = useQuery(SELECT_LIST_QUERY, {
    variables: {
      where: {
        ...(searchValue && {
          branchName_contains: searchValue
        }),
        company: selectedCompany.id
      },
      limit: 40,
      sort: `branchName:asc`
    }
  });

  const searchInputRef = useRef(null);

  // console.log("data", data);

  // Focus on search input
  /*   useEffect(() => {
    const focusOnSearchInput = async () => {
      const el = await searchInputRef.current.getInputElement();
      setTimeout(() => {
        el.focus();
      }, 1000);
    };
    focusOnSearchInput();
  }, []); */

  const handleSearch = _.debounce(value => {
    setSearchValue(value);
  }, 250);

  const chooseBranch = branch => {
    setSelectedBranch(branch);
    setFieldValue("branch", branch.id);
    setShowModal(false);
    // console.log("Chose branch", branch);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setShowModal(false)} fill="clear">
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Search Branch</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            ref={searchInputRef}
            animated={true}
            showCancelButton="never"
            // onFocus={() => console.log("onFocus")}
            onInput={e => handleSearch(e.target.value)}
            // onBlur={() => console.log("onBlur")}
            data-cy="onboard-employer-searchbranch-searchinput"
          />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <IonList>
            {[...Array(8).keys()].map(n => (
              <IonItem key={n}>
                <IonSkeletonText animated />
              </IonItem>
            ))}
          </IonList>
        ) : _.get(data, "branches") ? (
          <IonList data-cy="onboard-employer-searchbranch-results">
            <IonListHeader>
              <IonLabel className="text-uppercase">Results</IonLabel>
            </IonListHeader>
            {_.get(data, "branches").length ? (
              _.get(data, "branches").map((branch, i) => (
                <BranchItem
                  branch={branch}
                  key={branch.id}
                  chooseBranch={chooseBranch}
                />
              ))
            ) : (
              <IonItem className="text-center">
                Your search has no results.
              </IonItem>
            )}
          </IonList>
        ) : (
          <IonList>
            <IonItem className="text-center">Search for your branch.</IonItem>
          </IonList>
        )}
      </IonContent>
    </>
  );
};

const BranchItem = ({ branch, chooseBranch, ...props }) => {
  const { id, branchName, address } = branch;

  let note = "";

  if (_.has(address, "city")) {
    note = _.get(address, "city");
  }

  return (
    <IonItem
      key={id}
      button={true}
      onClick={() => chooseBranch(branch)}
      data-cy="onboard-employer-searchbranch-branchitem"
    >
      <IonLabel>{branchName}</IonLabel>
      <small>{note}</small>
    </IonItem>
  );
};

export default SearchEmployer;
