import Web3 from "web3";
import JurStatus from "./contracts/JurStatus.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:8545")
  },
  contracts: [JurStatus],
  events: {
    JurStatus: ["statusTypes"]
  },
  polls: {
    accounts: 1500
  }
};

export default options;
