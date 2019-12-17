import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Games from './components/Games'
import Stream from './components/Stream'
import Header from './components/Header'
import "bootstrap/dist/css/bootstrap.min.css"
import "shards-ui/dist/css/shards.min.css"

function App() {
  return (
    <Router>
      <Header />
      <Route exact path='/' component={Games} />
      <Route exact path='/top-streams' component={Stream} />
    </Router>
  );
}

export default App;
