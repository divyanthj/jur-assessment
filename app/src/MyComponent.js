import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm
} from "@drizzle/react-components";

import logo from "./logo.png";

export default ({ accounts, contracts }) => {
  console.log("Accounts", accounts, contracts);
  return (
    <div className="App">
      <div>
        <div>This is your contract address</div>
        <AccountData accountIndex={0} units="ether" precision={3} />
        <ContractForm
          contract="JurStatus"
          method="addStatusType"
          labels={["Add new status type here"]}
        />
        <ContractData
          contract="JurStatus"
          method="statusTypes"
          labels={["Add new status type here"]}
          toUtf8
        />
      </div>
    </div>
  );
};
