import React from "react";

import logo from "./logo.png";

class MyComponent extends React.Component {
  state = { dataKey: null };

  componentDidMount() {
    const { drizzle, drizzleState } = this.props;

    const contract = drizzle.contracts.JurStatus;

    // let drizzle know we want to watch the `myString` method
    const dataKey = contract.methods["statusCount"].cacheCall();
    this.setState({
      keyStatusCount: contract.methods["statusCount"].cacheCall(),
      keyStatusTypes: contract.methods["statusTypes"].cacheCall(),
      keyStatuses: contract.methods["status"].cacheCall()
    });
  }

  render() {
    // get the contract state from drizzleState
    const { JurStatus } = this.props.drizzleState.contracts;
    const statusCount = JurStatus.statusCount[this.state.keyStatusCount];
    const statusTypes = JurStatus.statusTypes[this.state.keyStatusTypes];
    console.log({
      statusCount,
      statusTypes
    });
    // using the saved `dataKey`, get the variable we're interested in

    // if it exists, then we display its value
    return <p></p>;
  }
}

export default MyComponent;
