import React, { Component } from "react";

import "./App.css";

import drizzleOptions from "./drizzleOptions";
import MyComponent from "./MyComponent";

class App extends Component {
  state = { loading: true, drizzleState: null };

  componentDidMount() {
    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { drizzle } = this.props;
    if (this.state.loading) return "Loading...";
    return (
      <div className="App">
        {
          <MyComponent
            drizzle={drizzle}
            drizzleState={this.state.drizzleState}
          />
        }
      </div>
    );
  }
}

export default App;
