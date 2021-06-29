const actionTypes = [
  {
    id: "DAILYBUDGET_UPDATE_SIMPLE",
    actions: [
      {
        id: "yes",
        title: "Yes"
      },
      {
        id: "no",
        title: "No"
      }
    ]
  },
  {
    id: "DAILYBUDGET_UPDATE_SIMPLE_AMOUNT",
    actions: [
      {
        id: "yes_amount",
        title: "Yes",
        input: true
      },
      {
        id: "no",
        title: "No",
        destructive: true
      }
    ]
  },
  {
    id: "DAILYBUDGET_UPDATE_SIMPLE_DESTRUCTIVE",
    actions: [
      {
        id: "yes_foreground",
        title: "Yes foreground",
        foreground: true
      },
      {
        id: "yes_input",
        title: "Yes Input",
        input: true,
        inputButtonTitle: "inputButtonTitle",
        inputPlaceholder: "inputPlaceholder"
      },
      {
        id: "no_innputplus",
        title: "No and Bye",
        inputButtonTitle: "inputButtonTitle",
        inputPlaceholder: "inputPlaceholder"
      }
    ]
  }
];

export default actionTypes;
