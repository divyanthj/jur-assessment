import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm
} from "@drizzle/react-components";

import logo from "./logo.png";

class MyComponent extends React.Component {
  render() {
    return (
      <div className="App">
        <div>
          <div>This is your contract address</div>
          <AccountData accountIndex={0} units="ether" precision={2} />
          <ContractForm
            contract="JurStatus"
            method="addStatusType"
            labels={["Add new status type here"]}
          />
          <ContractForm
            contract="JurStatus"
            method="addJurStatus"
            labels={["Holder", "Type position"]}
          />
          <div>Number of statuses</div>

          <ContractData contract="JurStatus" method="statusCount" />
        </div>
      </div>
    );
  }
}

export default MyComponent;
