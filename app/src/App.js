import React, { Component } from "react";
import { DrizzleProvider } from "@drizzle/react-plugin";
import { LoadingContainer, AccountData } from "@drizzle/react-components";

import "./App.css";

import drizzleOptions from "./drizzleOptions";
import MyContainer from "./MyContainer";

class App extends Component {
  render() {
    return (
      <DrizzleProvider options={drizzleOptions}>
        <div>
          <div>Hello world</div>
          <AccountData accountIndex={0} units={"ether"} precision={2} />
        </div>
      </DrizzleProvider>
    );
  }
}

export default App;
