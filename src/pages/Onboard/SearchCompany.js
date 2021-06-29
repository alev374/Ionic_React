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
  query CompanySelectListQuery(
    $limit: Int
    $start: Int
    $sort: String
    $where: JSON
  ) {
    companies(limit: $limit, start: $start, sort: $sort, where: $where) {
      id
      name
      branches {
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
  }
`;

const SearchEmployer = ({
  showModal,
  setShowModal,
  setFieldValue,
  setSelectedCompany,
  setSelectedBranch,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState("");
  const { data, loading } = useQuery(SELECT_LIST_QUERY, {
    variables: {
      where: {
        ...(searchValue && {
          name_contains: searchValue
        })
      },
      limit: 20,
      sort: `name:asc`
    }
  });

  const searchInputRef = useRef(null);
  // console.log("data", data);

  // Focus on search input
  /*  useEffect(() => {
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

  const chooseCompany = company => {
    setSelectedCompany(company);
    setFieldValue("company", company.id);

    if (_.get(company, "branches").length === 1) {
      setSelectedBranch(_.first(company.branches));
      setFieldValue("branch", _.first(company.branches).id);
    } else {
      setSelectedBranch(null);
      setFieldValue("branch", null);
    }

    // console.log("Chose company", company);
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
          <IonTitle>Search Company</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            ref={searchInputRef}
            animated={true}
            showCancelButton="never"
            // onFocus={() => console.log("onFocus")}
            onInput={e => handleSearch(e.target.value)}
            // onBlur={() => console.log("onBlur")}
            data-cy="onboard-employer-searchcompany-searchinput"
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
        ) : _.get(data, "companies") ? (
          <IonList data-cy="onboard-employer-searchcompany-results">
            <IonListHeader>
              <IonLabel className="text-uppercase">Results</IonLabel>
            </IonListHeader>
            {_.get(data, "companies").length ? (
              _.get(data, "companies").map((company, i) => (
                <CompanyItem
                  company={company}
                  key={company.id}
                  chooseCompany={chooseCompany}
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
            <IonItem className="text-center">Search for your company.</IonItem>
          </IonList>
        )}
      </IonContent>
    </>
  );
};

const CompanyItem = ({ company, chooseCompany, ...props }) => {
  const { id, name, branches } = company;

  let note = "";

  if (branches.length > 1) {
    note = <strong>{`${branches.length} branches`}</strong>;
  } else if (branches.length === 1) {
    const branch = _.first(branches);
    if (_.has(branch, "address.city")) {
      note = _.get(branch, "address.city");
    }
  } else {
    note = "No branches";
  }

  return (
    <IonItem
      key={id}
      button={true}
      onClick={() => chooseCompany(company)}
      data-cy="onboard-employer-searchcompany-companyitem" //Ew long name
    >
      <IonLabel>{name}</IonLabel>
      <small>{note}</small>
    </IonItem>
  );
};

export default SearchEmployer;
