import MyComponent from "./MyComponent";
import { drizzleConnect } from "@drizzle/react-plugin";

const mapStateToProps = state => {
  console.log("States", state);
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    contracts: state.contracts
  };
};

const MyContainer = drizzleConnect(MyComponent, mapStateToProps);

export default MyContainer;
