import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Registration from './Component/Registration';

function App(props) {
  return (
    <div>
      <Router>
        <Route
        exact
        strict
        component={Registration}
        path="/registration"
        history={props.history}
        />
      </Router>

    </div>

    
  );
}

export default App;
