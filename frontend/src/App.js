import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './carbon-components.min.css';
import TablePharmacies from './components/TablePharmacies';
import TablePharmaciesDates from './components/TablePharmaciesDates';
import Pharmacy from './components/Pharmacy';
import { Tabs, Tab } from 'carbon-components-react';

class App extends Component {


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to PharmaAdmin</h1>
        </header>
        <Tabs className="some-class" triggerHref="#anotherAnchor">
          <Tab
            className="another-class"
            label="Salto - Turn">
            <div className="some-content">
              <Pharmacy />
            </div>
          </Tab>
          <Tab
            className="another-class"
            label="Salto - Pharmacies">
            <div className="some-content">
              <TablePharmacies />
            </div>
          </Tab>
          <Tab
            className="another-class"
            label="Salto - Pharmacies Dates">
            <div className="some-content">
              <TablePharmaciesDates />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default App;
