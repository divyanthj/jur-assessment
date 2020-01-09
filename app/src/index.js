import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions.js";

// setup the drizzle store and drizzle
const drizzle = new Drizzle(drizzleOptions);

ReactDOM.render(<App drizzle={drizzle} />, document.getElementById("root"));
