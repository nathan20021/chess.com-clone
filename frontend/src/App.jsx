import React from "react"
import Chess from "./components/Chess/Chess"
import Home from "./components/Home/Home"
import Nav from "./components/Nav/Nav"
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

function App() {
  return(
    <Router>
      <div className="App">
        <Nav/>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/home" component={Home}/>
          <Route path="/play" component={Chess}/>
        </Switch>

      </div>
    </Router>
  )
}

export default App;
