import Web3 from "web3";
import JurStatus from "./contracts/JurStatus.json";
import SimpleStorage from "./contracts/SimpleStorage.json";
const options = {
  contracts: [JurStatus, SimpleStorage]
};

export default options;
