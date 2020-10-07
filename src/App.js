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
      currentUnitName: "Infantry",
      currentCOName: "Origin"
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
      this.state.options.unitProperties.forEach((unitProperty) => {
        this.setState(() => ({
          units: {
            ...this.state.units,
            [unitName]: {
              ...this.state.units[unitName],
              [unitProperty.name]: ""
            }
          }
        }));
      });
    });
  }

  changeJson = (event, propertyName) => {
    console.log("Json changed: " + propertyName + ", " + event.target.value);
    var inputValue = event.target.value;

    this.setState(() => ({
      units: {
        ...this.state.units,
        [this.state.currentUnitName]: {
          ...this.state.units[this.state.currentUnitName],
          [propertyName]: inputValue
        }
      }
    }));

    console.log(this.state);
  }

  generateJson = () => {
    console.log("Json generated");
  }

  changeUnitName = (unitName, isUnit) => {
    if (isUnit) {
      this.setState(() => ({
        currentUnitName: unitName
      }));
    }
    else {
      this.setState(() => ({
        currentCOName: unitName
      }));
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-container">
          <UnitList
            names={this.state.options.unitNames}
            isUnit={true}
            changeUnitName={this.changeUnitName}
          />
          <UnitList
            names={this.state.options.coNames}
            isUnit={false}
            changeUnitName={this.changeUnitName}
          />
          <Editor
            unitName={this.state.currentUnitName}
            coName={this.state.currentCOName}
            properties={this.state.options.unitProperties}
            unit={this.state.units[this.state.currentUnitName]}
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
            isUnit={props.isUnit}
            changeUnitName={props.changeUnitName}
          />
        ))}
      </ul>
    </div>
  );
}

function ListElement(props) {
  let imgSrc = "";

  if (props.isUnit) {
    imgSrc = "../resources/units/" + props.name + ".png";
  }
  else {
    imgSrc = "../resources/co/" + props.name + ".png";
  }

  return (
    <li className="Like-link" onClick={() => props.changeUnitName(props.name, props.isUnit)}>
      <img src={imgSrc} width="30px" height="30px"/>
      {props.name}
    </li>
  );
}

function Editor(props) {
  let unitImgSrc = "../resources/units/" + props.unitName + ".png";
  let coImgSrc = "../resources/co/" + props.coName + ".png";

  return (
    <div className="App-container-block-editor">
      <div className="Editor-header">
        <div className="Editor-header-element">
          <div>{props.unitName}</div>
          <img src={unitImgSrc} width="100px" height="100px"/>
        </div>
        <div className="Editor-header-element">
          <div>{props.coName}</div>
          <img src={coImgSrc} width="100px" height="100px"/>
        </div>
      </div>
      <ul>
        {props.properties.map((item, index) => (
          <EditorElement
            name={item.name}
            value={props.unit === undefined ? "" : props.unit[item.name]}
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
      <div className="Editor-container-element">{props.name}</div>
      <input className="Editor-input" value={props.value} onChange={(event) => props.changeJson(event, props.name)}/>
    </li>
  );
}

export default App;
