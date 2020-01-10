import React from "react";

import logo from "./logo.png";
import { ContractForm } from "@drizzle/react-components";

class MyComponent extends React.Component {
  state = {
    dataKeys: {},
    enteredStatusType: "",
    statusTypes: [],
    statuses: [],
    addresses: [],
    statusCount: 0
  };

  componentDidMount() {
    setTimeout(this.fetchStatusTypesCount, 1000);
    // let drizzle know we want to watch the `myString` method
    // const dataKey = contract.methods["statusCount"].cacheCall();
    // this.setState({
    //   keyStatusCount: contract.methods["statusCount"].cacheCall(),
    //   keyStatusTypes: contract.methods["statusTypes"].cacheCall(),
    //   keyStatuses: contract.methods["status"].cacheCall()
    // });
  }

  fetchStatusCount = () => {
    const { drizzle, drizzleState } = this.props;

    const contract = drizzle.contracts.JurStatus;
    const { JurStatus } = this.props.drizzleState.contracts;

    let dataKeys = {};
    dataKeys["statusCount"] = contract.methods["statusCount"].cacheCall();
    //dataKeys["statusTypes"] = contract.methods["statusTypes"].cacheCall([0]);
    const statusCount = JurStatus.statusCount[dataKeys.statusCount]
      ? JurStatus.statusCount[dataKeys.statusCount].value
      : 0;
    //const statusTypes = JurStatus.statusTypes[dataKeys.statusTypes];
    this.setState({
      dataKeys: {
        ...dataKeys
      },
      statusCount: parseInt(statusCount)
    });
  };

  fetchAllAddresses = () => {
    const { statusCount } = this.state;
    const { drizzle, drizzleState } = this.props;

    const contract = drizzle.contracts.JurStatus;
    const { JurStatus } = this.props.drizzleState.contracts;
    let dataKeys = {};
    let addresses = [];
    for (var i = 0; i < statusCount; i++) {
      dataKeys["address_" + i] = contract.methods["addresses"].cacheCall(i); // Storing status key for each entry
      const pulledAddress = JurStatus.addresses[dataKeys["address_" + i]];
      console.log("Address from contract", pulledAddress, i);
      if (pulledAddress) addresses.push(pulledAddress);
    }
    //console.log("Status", status, dataKeys);
    this.setState({
      dataKeys: {
        ...dataKeys
      },
      addresses
    });
    console.log("Pulled addresses", addresses);
  };

  fetchAllStatuses = () => {
    const { statusCount, addresses } = this.state;
    const { drizzle, drizzleState } = this.props;

    const contract = drizzle.contracts.JurStatus;
    const { JurStatus } = this.props.drizzleState.contracts;
    console.log("Jur Status", JurStatus);
    let dataKeys = {};
    let status = [];
    addresses.forEach((address, index) => {
      dataKeys["status_" + index] = contract.methods["status"].cacheCall(
        address.value
      );
      const pulledStatus = JurStatus.status[dataKeys["status_" + index]];
      if (pulledStatus) status.push(pulledStatus);
    });

    console.log("Status after retrieving", status);
    // let tempDataKey = contract.methods.status.cacheCall(
    //   "0x1CC458D7883BE736E8a8f6b809B4Ad345216844e"
    // );
    // let result = JurStatus.status[tempDataKey];
    // console.log("Result", result);
    // for (var i = 0; i <= statusCount; i++) {
    //   console.log("Fetching for status ", i, "status_" + i, dataKeys);
    //   dataKeys["status_" + i] = contract.methods["status"].cacheCall(i); // Storing status key for each entry
    //   const pulledStatus = JurStatus.status[dataKeys["status_" + i]];
    //   //console.log("Status from contract", pulledStatus);
    //   status.push(pulledStatus);
    // }
    // //console.log("Status", status, dataKeys);
    // this.setState({
    //   dataKeys: {
    //     ...dataKeys
    //   },
    //   status
    // });
    // dataKeys["statusTypes"] = contract.methods["statusTypes"];
    // console.log("Statuses", {
    //   status,
    //   dataKeys
    // });
  };

  handleFetchData = () => {
    this.fetchStatusCount();
    if (this.state.statusCount > 0) this.fetchAllAddresses();
    if (this.state.addresses.length > 0) this.fetchAllStatuses();
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = (params, method) => {
    const { drizzle } = this.props;

    const contract = drizzle.contracts.JurStatus;
    let submittedData = [];
    params.forEach(param => {
      submittedData.push(this.state[param]);
    });
    const stackId = contract.methods[method].cacheSend(...submittedData);
    this.setState({ stackId });
  };

  getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // otherwise, return the transaction status
    return `Transaction status: ${transactions[txHash] &&
      transactions[txHash].status}`;
  };

  render() {
    // get the contract state from drizzleState
    const {
      enteredStatusType,
      enteredStatusHolderAddress,
      enteredStatusTypeIndex
    } = this.state;

    // using the saved `dataKey`, get the variable we're interested in

    // if it exists, then we display its value
    return (
      <div>
        <button onClick={this.handleFetchData}>Get data</button>
        <div>
          <input
            onChange={this.handleInputChange}
            placeholder={"New status type"}
            name={"enteredStatusType"}
            value={enteredStatusType}
          />
          <button
            onClick={() =>
              this.handleSubmit(["enteredStatusType"], "addStatusType")
            }
          >
            Submit
          </button>
        </div>
        <div>
          <input
            onChange={this.handleInputChange}
            placeholder={"New status type"}
            name={"enteredStatusHolderAddress"}
            value={enteredStatusHolderAddress}
          />
          <input
            onChange={this.handleInputChange}
            placeholder={"New status type"}
            name={"enteredStatusTypeIndex"}
            value={enteredStatusTypeIndex}
          />
          <button
            onClick={() =>
              this.handleSubmit(
                ["enteredStatusHolderAddress", "enteredStatusTypeIndex"],
                "addJurStatus"
              )
            }
          >
            Submit
          </button>
        </div>

        <div>{this.getTxStatus()}</div>
      </div>
    );
  }
}

export default MyComponent;
