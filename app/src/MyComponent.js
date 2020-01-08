import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm
} from "@drizzle/react-components";

import logo from "./logo.png";

export default ({ accounts }) => {
  console.log("Accounts", accounts);
  return (
    <div className="App">
      <div>Hello world</div>
      <AccountData accountIndex={0} units="ether" precision={3} />
      <ContractForm contract="JurStatus" method="addStatusType" />
    </div>
  );
};
