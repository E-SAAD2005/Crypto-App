import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter as Router} from "react-router-dom";
import 'antd/dist/reset.css';
import {Provider} from 'react-redux';
import Store from "./app/Store";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <Provider store={Store}>
      <App />
      </Provider>
    </Router>
);
