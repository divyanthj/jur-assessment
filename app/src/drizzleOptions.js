import Web3 from "web3";
import JurStatus from "./contracts/JurStatus.json";
const options = {
  contracts: [JurStatus],
  events: {
    JurStatus: ["StateChanged", "StatusAdded"]
  }
};

export default options;
