import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        unitNames: [],
        unitProperties: [],
        coNames: []
      },
      units: {},
      currentUnitName: "Infantry"
    };

    fetch('../data/options.json').then(response => {
      return response.json();
    }).then(data => {
      this.setState(() => ({
        options: data
      }));
      this.initJson();
    }).catch(err => {
      // Do something for an error here
      console.log("Error Reading data " + err);
    });

    this.changeJson = this.changeJson.bind(this);
    this.changeUnitName = this.changeUnitName.bind(this);
  }

  initJson = () => {
    this.state.options.unitNames.forEach((unitName) => {
      this.setState(() => ({
        units: {
          ...this.state.units,
          [unitName]: {}
        }
      }));
    });
  }

  changeJson = (event, propertyName) => {
    console.log("Json changed: " + propertyName + ", " + event.target.value);
    var inputValue = event.target.value;

    this.setState(() => ({
      units: {
        ...this.state.units,
        [this.state.currentUnitName]: {
          ...this.state.units.Infantry,
          [propertyName]: inputValue
        }
      }
    }));

    console.log(this.state);
  }

  generateJson = () => {
    console.log("Json generated");
  }

  changeUnitName = (unitName) => {
    this.setState(() => ({
      currentUnitName: unitName
    }));
  }

  render() {
    return (
      <div className="App">
        <div className="App-container">
          <UnitList
            names={this.state.options.unitNames}
            changeUnitName={this.changeUnitName}
          />
          <Editor
            unitName={this.state.currentUnitName}
            properties={this.state.options.unitProperties}
            changeJson={this.changeJson}
          />
        </div>
        <button onClick={this.generateJson}>Download JSON</button>
      </div>
    );
  }
}

function UnitList(props) {
  return (
    <div className="App-container-block">
      <ul>
        {props.names.map((item, index) => (
          <ListElement
            name={item}
            changeUnitName={props.changeUnitName}
          />
        ))}
      </ul>
    </div>
  );
}

function ListElement(props) {
  let imgSrc = "../resources/units/" + props.name + ".png";

  return (
    <li className="Like-link" onClick={() => props.changeUnitName(props.name)}>
      <img src={imgSrc} width="30px" height="30px"/>
      {props.name}
    </li>
  );
}

function Editor(props) {
  let imgSrc = "../resources/units/" + props.unitName + ".png";

  return (
    <div className="App-container-block">
      <div>{props.unitName}</div>
      <img src={imgSrc} width="100px" height="100px"/>
      <ul>
        {props.properties.map((item, index) => (
          <EditorElement
            name={item.name}
            changeJson={props.changeJson}
          />
        ))}
      </ul>
    </div>
  );
}

function EditorElement(props) {
  return (
    <li className="Editor-container">
      <div class="Editor-container-element">{props.name}</div>
      <input onChange={(event) => props.changeJson(event, props.name)} class="Editor-container-element"/>
    </li>
  );
}

export default App;
