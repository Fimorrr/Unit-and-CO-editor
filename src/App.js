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
      currentCOName: "Origin",
      isJsonInit: false
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
    let {unitNames, unitProperties, coNames} = this.state.options;

    coNames.forEach((coName) => {
      this.setState(() => ({
        units: {
          ...this.state.units,
          [coName]: {}
        }
      }));
    });

    coNames.forEach((coName) => {
      unitNames.forEach((unitName) => {
        unitProperties.forEach((unitProperty) => {
          this.setState(() => ({
            units: {
              ...this.state.units,
              [coName]: {
                ...this.state.units[coName],
                [unitName]: {
                  ...this.state.units[coName][unitName],
                  [unitProperty.name]: {
                    value: "",
                    hasValue: false
                  }
                }
              }
            }
          }));
        });
      });
    });

    this.setState(() => ({
      isJsonInit: true
    }));
  }

  changeJson = (event, propertyName, isProperty) => {
    let fieldName = "value";

    if (!isProperty) {
      fieldName = "hasValue";
    }

    let inputType = event.target.type;
    let inputValue = event.target.value;

    if (inputType === "checkbox") {
      inputValue = event.target.checked;
    }

    this.setState(() => ({
      units: {
        ...this.state.units,
        [this.state.currentCOName]: {
          ...this.state.units[this.state.currentCOName],
          [this.state.currentUnitName]: {
            ...this.state.units[this.state.currentCOName][this.state.currentUnitName],
            [propertyName]: {
              ...this.state.units[this.state.currentCOName][this.state.currentUnitName][propertyName],
              [fieldName]: inputValue
            }
          }
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
            isJsonInit={this.state.isJsonInit}
            unitName={this.state.currentUnitName}
            coName={this.state.currentCOName}
            properties={this.state.options.unitProperties}
            units={this.state.units[this.state.currentCOName]}
            originUnits={this.state.units["Origin"]}
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
      <img src={imgSrc} width="30px" height="30px" />
      {props.name}
    </li>
  );
}

function Editor(props) {
  if (!props.isJsonInit || props.units == null || props.originUnits == null) {
    return "";
  }

  let unitImgSrc = "../resources/units/" + props.unitName + ".png";
  let coImgSrc = "../resources/co/" + props.coName + ".png";

  return (
    <div className="App-container-block-editor">
      <div className="Editor-header">
        <div className="Editor-header-element">
          <div>{props.unitName}</div>
          <img src={unitImgSrc} width="100px" height="100px" />
        </div>
        <div className="Editor-header-element">
          <div>{props.coName}</div>
          <img src={coImgSrc} width="100px" height="100px" />
        </div>
      </div>
      <ul>
        {props.properties.map((item, index) => (
          <EditorElement
            coName={props.coName}
            propertyName={item.name}
            property={props.units[props.unitName][item.name]}
            originProperty={props.originUnits[props.unitName][item.name]}
            changeJson={props.changeJson}
          />
        ))}
      </ul>
    </div>
  );
}

function EditorElement(props) {
  if (props.property == null) {
    return "";
  }

  let isNotOrigin = props.coName !== "Origin";
  let hasNotOwnValue = isNotOrigin && !props.property.hasValue;

  return (
    <li className="Editor-container">
      <div className="Editor-container-element">{props.propertyName}</div>
      {isNotOrigin ? <input type="checkbox" checked={props.property.hasValue} onChange={(event) => props.changeJson(event, props.propertyName, false)} /> : ""}
      <input
        className="Editor-input"
        value={hasNotOwnValue ? props.originProperty.value : props.property.value}
        disabled={hasNotOwnValue}
        onChange={(event) => props.changeJson(event, props.propertyName, true)} />
    </li>
  );
}

export default App;
