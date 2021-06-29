import React from "react";
import { AsYouType, getCountryCallingCode } from "libphonenumber-js/max";
import { InputAdornment, TextField as MuiTextField } from "@material-ui/core";

const userPhoneNumber = new AsYouType("PH");
const countryCode = getCountryCallingCode("PH");

const PhoneNumberInput = ({ value, ...props }) => {
  // Value still has +63 at this point
  userPhoneNumber.reset();
  const valueNoAreaCode = userPhoneNumber
    .input(value)
    .replace(`+${countryCode}`, "");

  // Trim whitespace at the front
  const valueTrimmed = valueNoAreaCode.trim();
  // Value no longer has +63. Tada!

  return (
    <MuiTextField
      {...props}
      type="tel"
      inputMode="tel"
      value={valueTrimmed}
      onChange={e => {
        const value = `+${countryCode} ${e.target.value}`;
        // Remove whitespace and ensure character count.
        const trimmedValue = value.replace(/ /g, "").slice(0, 13);

        userPhoneNumber.reset();
        userPhoneNumber.input(trimmedValue);
        const finalValue = userPhoneNumber.getNumber()
          ? userPhoneNumber.getNumber().number
          : trimmedValue;

        props.onChange(finalValue);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">+{countryCode}</InputAdornment>
        )
      }}
    />
  );
};

export default PhoneNumberInput;
