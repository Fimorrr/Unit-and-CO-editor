import React, { Component } from 'react';
import Editor from './Components/Editor'
import UnitList from './Components/UnitList';
import UpgradeList from './Components/UpgradeList';
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
      upgrades: {},
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
    this.addUpgradeRow = this.addUpgradeRow.bind(this);  
    this.addUpgradeItem = this.addUpgradeItem.bind(this);
  }

  initJson = () => {
    let {unitNames, unitProperties, coNames, fractionNames} = this.state.options;

    //Прединициация юнитов
    coNames.forEach((coName) => {
      this.setState(() => ({
        units: {
          ...this.state.units,
          [coName]: {}
        }
      }));
    });
    //Инициация юнитов
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

    //Прединициация апгрейдов
    fractionNames.forEach((fractionName) => {
      this.setState(() => ({
        upgrades: {
          ...this.state.upgrades,
          [fractionName]: {}
        }
      }));
    });
    //Инициация апгрейдов
    fractionNames.forEach((fractionName) => {
      unitNames.forEach((unitName) => {
        this.setState(() => ({
          upgrades: {
            ...this.state.upgrades,
            [fractionName]: {
              ...this.state.upgrades[fractionName],
              [unitName]: []
            }
          }
        }));
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

  addUpgradeRow = () => {

  }

  addUpgradeItem = (rowNumber) => {
    let {currentUnitName, currentFractionName} = this.state;

    this.setState(() => ({
      upgrades: {
        ...this.state.upgrades,
        [currentFractionName]: {
          ...this.state.upgrades[currentFractionName],
          [currentUnitName]: [
            ...this.state.upgrades[currentFractionName][currentUnitName],
            {
              rowNumber: rowNumber,
              itemName: "item"
            }
          ]
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
          <div className="App-container-block">
            <UnitList
              names={this.state.options.unitNames}
              type="unit"
              currentName={this.state.currentUnitName}
              changeCurrentName={this.changeCurrentName}
            />
            <hr/>
            <UnitList
              names={this.state.options.coNames}
              type="co"
              currentName={this.state.currentCOName}
              changeCurrentName={this.changeCurrentName}
            />
          </div>
          <div className="App-container-block">
            <UnitList
              names={this.state.options.fractionNames}
              type="fraction"
              currentName={this.state.currentFractionName}
              changeCurrentName={this.changeCurrentName}
            />
            <hr/>
            <UpgradeList
              isJsonInit={this.state.isJsonInit}
              unitName={this.state.currentUnitName}
              fractionName={this.state.currentFractionName}
              upgrades={this.state.upgrades}
              addUpgradeRow={this.addUpgradeRow}
              addUpgradeItem={this.addUpgradeItem}
            />
          </div>
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

export default App;
