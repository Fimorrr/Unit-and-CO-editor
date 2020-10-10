import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        unitProperties: [],
        unitNames: [],
        coNames: [],
        fractionNames: [],
        dictionaries: {}
      },
      units: {},
      currentUnitName: "Infantry",
      currentCOName: "Origin",
      currentFractionName: "League",
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
    this.changeCurrentName = this.changeCurrentName.bind(this);
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
                    value: this.getInitValue(unitProperty.type),
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

  getInitValue = (type) => {
    if (type === "int" || type === "enum") {
      return 0;
    }
    if (type === "bool") {
      return false;
    }
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

  changeCurrentName = (name, type) => {
    if (type === "unit") {
      this.setState(() => ({
        currentUnitName: name
      }));
    }
    else if (type === "co") {
      this.setState(() => ({
        currentCOName: name
      }));
    }
    else if (type === "fraction") {
      this.setState(() => ({
        currentFractionName: name
      }));
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-container">
          <div>
            <UnitList
              names={this.state.options.unitNames}
              type="unit"
              currentName={this.state.currentUnitName}
              changeCurrentName={this.changeCurrentName}
            />
            <hr></hr>
            <UnitList
              names={this.state.options.coNames}
              type="co"
              currentName={this.state.currentCOName}
              changeCurrentName={this.changeCurrentName}
            />
          </div>
          <UnitList
              names={this.state.options.fractionNames}
              type="fraction"
              currentName={this.state.currentFractionName}
              changeCurrentName={this.changeCurrentName}
            />
          <Editor
            isJsonInit={this.state.isJsonInit}
            unitName={this.state.currentUnitName}
            coName={this.state.currentCOName}
            properties={this.state.options.unitProperties}
            units={this.state.units[this.state.currentCOName]}
            dictionaries={this.state.options.dictionaries}
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
            type={props.type}
            isSelected={props.currentName === item}
            changeCurrentName={props.changeCurrentName}
          />
        ))}
      </ul>
    </div>
  );
}

function ListElement(props) {
  let imgSrc = "";

  if (props.type === "unit") {
    imgSrc = "../resources/units/" + props.name + ".png";
  }
  else if (props.type === "co") {
    imgSrc = "../resources/co/" + props.name + ".png";
  }
  else if (props.type === "fraction") {
    imgSrc = "../resources/fractions/" + props.name + ".png";
  }

  return (
    <li className={props.isSelected ? "Like-link-selected" : "Like-link"} onClick={() => props.changeCurrentName(props.name, props.type)}>
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
            propertyType={item.type}
            dictionary={item.type === "enum" ? props.dictionaries[item.name] : []}
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

  let control;

  if (props.propertyType === "enum") {
    control = (
      <select
        className="Editor-input"
        disabled={hasNotOwnValue}
        value={hasNotOwnValue ? props.originProperty.value : props.property.value}
        onChange={(event) => props.changeJson(event, props.propertyName, true)}>
        {props.dictionary.map((item, index) => (
          <option value={index}>{item}</option>
        ))}
      </select>
    )
  }
  else if (props.propertyType === "bool") {
    control = (
      <input
        className="Editor-input"
        type="checkbox"
        value={hasNotOwnValue ? props.originProperty.value : props.property.value}
        disabled={hasNotOwnValue}
        onChange={(event) => props.changeJson(event, props.propertyName, true)} />
    )
  }
  else {
    control = (
      <input
        className="Editor-input"
        type="number"
        value={hasNotOwnValue ? props.originProperty.value : props.property.value}
        disabled={hasNotOwnValue}
        onChange={(event) => props.changeJson(event, props.propertyName, true)} />
    )
  }

  return (
    <li className="Editor-container">
      <div className="Editor-container-element">{props.propertyName}</div>
      {isNotOrigin ? <input type="checkbox" checked={props.property.hasValue} onChange={(event) => props.changeJson(event, props.propertyName, false)} /> : ""}
      {control}
    </li>
  );
}

export default App;
