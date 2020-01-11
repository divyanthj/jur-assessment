import React from "react";
import moment from "moment-timezone";
import logo from "./logo.png";
import Result from "web3";
import {
  Input,
  Button,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TableContainer,
  Switch
} from "@material-ui/core";
import { ContractForm } from "@drizzle/react-components";
const styles = {
  tableCell: {},
  table: {
    minWidth: 650,
    tableLayout: "fixed"
  }
};

class MyComponent extends React.Component {
  state = {
    dataKeys: {},
    enteredStatusType: "",
    statusTypes: [],
    statuses: [],
    addresses: [],
    statusCount: 0,
    statusTypesCount: 0,
    pollingInterval: 100
  };

  componentDidMount() {
    this.pollData();
  }

  pollData = () => {
    let pollCount = 0;
    let pollLimit = 10;
    let pollId = setInterval(() => {
      if (this.state.statuses.length > 0 || pollCount === pollLimit) {
        clearInterval(pollId);
      }
      this.handleFetchData();
      pollCount++;
    }, this.state.pollingInterval);
  };

  fetchPrimitive = variableName => {
    const { drizzle, drizzleState } = this.props;

    const contract = drizzle.contracts.JurStatus;
    const { JurStatus } = this.props.drizzleState.contracts;

    let dataKeys = {};
    dataKeys[variableName] = contract.methods[variableName].cacheCall();
    //dataKeys["statusTypes"] = contract.methods["statusTypes"].cacheCall([0]);
    const variable = JurStatus[variableName][dataKeys[variableName]]
      ? JurStatus[variableName][dataKeys[variableName]].value
      : 0;

    this.setState({
      dataKeys: {
        ...dataKeys
      },
      [variableName]: variable
    });
  };

  fetchArray = (arrayName, arrayCounterName) => {
    const { drizzle, drizzleState } = this.props;

    const contract = drizzle.contracts.JurStatus;
    const { JurStatus } = this.props.drizzleState.contracts;
    let dataKeys = {};
    let array = [];
    for (var i = 0; i < this.state[arrayCounterName]; i++) {
      dataKeys[arrayName + i] = contract.methods[arrayName].cacheCall(i); // Storing status key for each entry
      const pulledItem = JurStatus[arrayName][dataKeys[arrayName + i]];
      if (pulledItem) array.push(pulledItem);
    }
    console.log("Array " + arrayName, array);
    this.setState({
      dataKeys: {
        ...dataKeys
      },
      [arrayName]: array
    });
  };

  fetchAllStatuses = () => {
    const { statusCount, addresses } = this.state;
    const { drizzle, drizzleState } = this.props;

    const contract = drizzle.contracts.JurStatus;
    const { JurStatus } = this.props.drizzleState.contracts;
    let dataKeys = {};
    let statuses = [];
    addresses.forEach((address, index) => {
      dataKeys["status_" + index] = contract.methods["status"].cacheCall(
        address.value
      );
      const pulledStatus = JurStatus.status[dataKeys["status_" + index]];
      if (pulledStatus) {
        const statusObject = {
          holder: address.value,
          ...JSON.parse(JSON.stringify(pulledStatus.value))
        };
        statuses.push(statusObject);
      }
    });
    console.log("Statuses", statuses);
    this.setState({
      statuses
    });
  };

  handleFetchData = () => {
    this.fetchPrimitive("statusCount");
    this.fetchPrimitive("statusTypesCount");
    if (this.state.statusCount > 0) this.fetchArray("addresses", "statusCount");
    if (this.state.statusTypesCount > 0)
      this.fetchArray("statusTypes", "statusTypesCount");
    if (this.state.addresses.length > 0) this.fetchAllStatuses();
    //console.log("React state", this.state);
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = (params, method) => {
    const { drizzle, drizzleState } = this.props;

    const contract = drizzle.contracts.JurStatus;
    const contractState = drizzleState.contracts.JurStatus;
    let submittedData = [];
    params.forEach(param => {
      submittedData.push(this.state[param]);
    });
    const stackId = contract.methods[method].cacheSend(...submittedData);
    this.setState({ stackId });
    this.pollData();
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
      enteredStatusTypeIndex,
      statuses
    } = this.state;
    // using the saved `dataKey`, get the variable we're interested in

    // if it exists, then we display its value
    return (
      <Grid container style={styles.container}>
        <Grid item xs={12}>
          {/* Form for adding new status type */}
          <Input
            onChange={this.handleInputChange}
            placeholder={"New status type"}
            name={"enteredStatusType"}
            value={enteredStatusType}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() =>
              this.handleSubmit(["enteredStatusType"], "addStatusType")
            }
          >
            Submit
          </Button>
        </Grid>
        <Grid item xs={12}>
          {/* Form for adding address and type */}
          <Input
            onChange={this.handleInputChange}
            placeholder={"Status holder address"}
            name={"enteredStatusHolderAddress"}
            value={enteredStatusHolderAddress}
          />
          <Input
            onChange={this.handleInputChange}
            placeholder={"Status type index"}
            name={"enteredStatusTypeIndex"}
            value={enteredStatusTypeIndex}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() =>
              this.handleSubmit(
                ["enteredStatusHolderAddress", "enteredStatusTypeIndex"],
                "addJurStatus"
              )
            }
          >
            Submit
          </Button>
          <Grid item xs={9}>
            {/* Table of addresses, activation times and types */}
            <Grid container>
              <Grid item xs={5}>
                Holder
              </Grid>
              <Grid item xs={3}>
                Activation Time
              </Grid>
              <Grid item xs={3}>
                Status Type
              </Grid>

              <Grid item xs={1}>
                Is active
              </Grid>
            </Grid>
            {statuses.map(statusItem => {
              return (
                <Grid container>
                  <Grid item xs={5}>
                    {statusItem.holder}
                  </Grid>
                  <Grid item xs={3}>
                    {moment(statusItem.activationTime * 1000).format(
                      "YYYY-MM-DD HH:mm"
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {statusItem.statusType}
                  </Grid>
                  <Grid item xs={1}>
                    <Switch
                      checked={statusItem.isActive}
                      onChange={() => {
                        this.setState(
                          {
                            currentHolder: statusItem.holder,
                            currentIsActive: !statusItem.isActive
                          },
                          () => {
                            this.handleSubmit(
                              ["currentHolder", "currentIsActive"],
                              "changeState"
                            );
                          }
                        );
                      }}
                      color="primary"
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        <div>{this.getTxStatus()}</div>
      </Grid>
    );
  }
}

export default MyComponent;
