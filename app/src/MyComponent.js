import React from "react";
import moment from "moment-timezone";
import logo from "./logo.png";
import { withStyles } from "@material-ui/core/styles";
import {
  Input,
  TextField,
  Button,
  Grid,
  Switch,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  InputLabel
} from "@material-ui/core";
import { ContractForm } from "@drizzle/react-components";
const styles = {
  tableCell: {},
  table: {
    minWidth: 650,
    marginTop: 18,
    tableLayout: "fixed"
  },
  tableRow: {
    width: "100%",
    display: "block"
  },
  tableCell: {
    width: "20%",
    display: "inline-block"
  },
  tableCellSmaller: {
    width: "10%"
  },
  formControl: {
    width: 100
  },
  loader: {
    marginLeft: 0,
    marginTop: 2
  },
  submit: {
    margin: 18
  },
  select: {
    marginTop: 0.5,
    width: 100
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
    const { classes } = this.props;
    return <CircularProgress size={11} className={classes.loader} />;
  };

  render() {
    // get the contract state from drizzleState
    const {
      enteredStatusType,
      enteredStatusHolderAddress,
      enteredStatusTypeIndex,
      statuses,
      statusTypes,
      transactionStatus,
      lastSetParam,
      lastSetMethod
    } = this.state;

    const { classes } = this.props;

    // Misc bools for conditional rendering
    const isPending = transactionStatus === "pending";
    const isStatusTypeSubmitting =
      isPending && lastSetMethod === "addStatusType";
    const isStatusSubmitting = isPending && lastSetParam === "addJurStatus";

    return (
      <div>
        {/* Form for adding new status type */}
        <div>
          <TextField
            onChange={this.handleInputChange}
            label={"New status type"}
            name={"enteredStatusType"}
            value={enteredStatusType}
            style={{ width: 500 }}
          />

          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() =>
              this.handleSubmit(["enteredStatusType"], "addStatusType")
            }
            className={classes.submit}
          >
            Submit
          </Button>

          {isStatusTypeSubmitting && this.renderLoader()}
        </div>

        {statusTypes.length > 0 && (
          <div>
            {/* Form for adding address and type */}

            <TextField
              onChange={this.handleInputChange}
              label={"Status holder address"}
              name={"enteredStatusHolderAddress"}
              value={enteredStatusHolderAddress}
              style={{ width: 400 }}
            />

            <FormControl
              className={classes.formControl}
              className={classes.select}
            >
              <InputLabel
                shrink
                id="demo-simple-select-placeholder-label-label"
              >
                Status Type
              </InputLabel>
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
              className={classes.submit}
            >
              Submit
            </Button>
            {isStatusSubmitting && this.renderLoader()}
          </div>
        )}

        {statuses.length > 0 && (
          <div className={classes.table}>
            {/* Table of addresses, activation times and types */}
            <div
              className={classes.tableRow}
              style={{ fontWeight: 500, paddingBottom: 12 }}
            >
              <div className={classes.tableCell}>Holder</div>
              <div
                className={classes.tableCell + " " + classes.tableCellSmaller}
              >
                Activation Time
              </div>
              <div
                className={classes.tableCell + " " + classes.tableCellSmaller}
              >
                Status Type
              </div>

              <div
                className={classes.tableCell + " " + classes.tableCellSmaller}
              >
                Is active
              </div>
            </div>
            {statuses.map(statusItem => {
              return (
                <div className={classes.tableRow}>
                  <div className={classes.tableCell} style={{ fontSize: 14 }}>
                    {statusItem.holder}
                  </div>
                  <div
                    className={
                      classes.tableCell + " " + classes.tableCellSmaller
                    }
                  >
                    {moment(statusItem.activationTime * 1000).format(
                      "YYYY-MM-DD HH:mm"
                    )}
                  </div>
                  <div
                    className={
                      classes.tableCell + " " + classes.tableCellSmaller
                    }
                  >
                    {statusItem.statusType}
                  </div>
                  <div
                    className={
                      classes.tableCell + " " + classes.tableCellSmaller
                    }
                  >
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
                    {this.state[lastSetParam] === statusItem.holder &&
                      transactionStatus === "pending" &&
                      this.renderLoader()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(MyComponent);
