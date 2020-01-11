import React from "react";
import moment from "moment-timezone";
import logo from "./logo.png";
import {
  Input,
  Button,
  Grid,
  Switch,
  MenuItem,
  FormControl,
  Select,
  CircularProgress
} from "@material-ui/core";
import { ContractForm } from "@drizzle/react-components";
const styles = {
  tableCell: {},
  table: {
    minWidth: 650,
    tableLayout: "fixed"
  },
  formControl: {
    width: 100
  },
  loader: {
    marginLeft: 20
  }
};

class MyComponent extends React.Component {
  state = {
    dataKeys: {},
    enteredStatusType: "",
    enteredStatusTypeIndex: 0,
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

  componentDidUpdate = () => {
    const transactionStatus = this.getTxStatus();

    if (this.state.transactionStatus !== transactionStatus) {
      if (transactionStatus === "success") setTimeout(this.pollData, 1000);
      this.setState({
        transactionStatus
      });
    }
  };

  pollData = () => {
    let pollCount = 0;
    let pollLimit = 10;
    console.log("Polling data..");
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
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSelectChange = e => {
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
    this.setState({
      stackId,
      lastSetMethod: method,
      lastSetParam: params[0]
    });
  };

  getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];
    if (!txHash) return null;
    return transactions[txHash] ? transactions[txHash].status : null;
  };

  renderLoader = () => {
    return <CircularProgress size={11} style={styles.loader} />;
  };

  render() {
    // get the contract state from drizzleState
    const {
      enteredStatusType,
      enteredStatusHolderAddress,
      enteredStatusTypeIndex,
      statuses,
      transactionStatus,
      lastSetParam,
      lastSetMethod
    } = this.state;

    // Misc bools for conditional rendering
    const isPending = transactionStatus === "pending";
    const isStatusTypeSubmitting =
      isPending && lastSetMethod === "addStatusType";
    const isStatusSubmitting = isPending && lastSetParam === "addJurStatus";

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
          {isStatusTypeSubmitting && this.renderLoader()}
        </Grid>
        <Grid item xs={12}>
          {/* Form for adding address and type */}
          <Input
            onChange={this.handleInputChange}
            placeholder={"Status holder address"}
            name={"enteredStatusHolderAddress"}
            value={enteredStatusHolderAddress}
          />

          <FormControl style={styles.formControl}>
            <Select
              value={enteredStatusTypeIndex}
              onChange={this.handleSelectChange}
              name={"enteredStatusTypeIndex"}
            >
              {this.state.statusTypes.map((typeItem, index) => {
                return <MenuItem value={index}>{typeItem.value}</MenuItem>;
              })}
            </Select>
          </FormControl>
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
          {isStatusSubmitting && this.renderLoader()}
          <Grid item xs={9}>
            {/* Table of addresses, activation times and types */}
            <Grid container>
              <Grid item xs={5}>
                Holder
              </Grid>
              <Grid item xs={3}>
                Activation Time
              </Grid>
              <Grid item xs={2}>
                Status Type
              </Grid>

              <Grid item xs={1}>
                Is active
              </Grid>
              <Grid item xs={1}></Grid>
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
                  <Grid item xs={2}>
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
                  <Grid item xs={1}>
                    {this.state[lastSetParam] === statusItem.holder &&
                      transactionStatus === "pending" &&
                      this.renderLoader()}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default MyComponent;
