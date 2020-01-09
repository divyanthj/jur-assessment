import React from "react";

import logo from "./logo.png";

class MyComponent extends React.Component {
  state = { dataKeys: {}, enteredStatusType: "" };

  componentDidMount() {
    const { drizzle, drizzleState } = this.props;

    const contract = drizzle.contracts.JurStatus;
    let dataKeys = {};
    dataKeys["statusCount"] = contract.methods["statusCount"].cacheCall();
    this.setState({
      dataKeys
    });
    // let drizzle know we want to watch the `myString` method
    // const dataKey = contract.methods["statusCount"].cacheCall();
    // this.setState({
    //   keyStatusCount: contract.methods["statusCount"].cacheCall(),
    //   keyStatusTypes: contract.methods["statusTypes"].cacheCall(),
    //   keyStatuses: contract.methods["status"].cacheCall()
    // });
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    const { drizzle } = this.props;

    const contract = drizzle.contracts.JurStatus;
    const submittedData = this.state[e.target.name];
    const stackId = contract.methods["addStatusType"].cacheSend(submittedData);
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
    const { enteredStatusType } = this.state;
    const { JurStatus } = this.props.drizzleState.contracts;
    const statusCount = JurStatus.statusCount[this.state.dataKeys.statusCount];
    console.log({
      statusCount
    });
    // using the saved `dataKey`, get the variable we're interested in

    // if it exists, then we display its value
    return (
      <div>
        <input
          onChange={this.handleInputChange}
          placeholder={"New status type"}
          name={"enteredStatusType"}
          value={enteredStatusType}
        />
        <button onClick={this.handleSubmit} name={"enteredStatusType"}>
          Submit
        </button>
        <div>{this.getTxStatus()}</div>
      </div>
    );
  }
}

export default MyComponent;
