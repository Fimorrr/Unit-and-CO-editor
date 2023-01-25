import React, { Component } from 'react';
import Editor from './Components/Editor'
import UpgradeEditor from './Components/UpgradeEditor'
import UnitList from './Components/UnitList';
import UpgradeList from './Components/UpgradeList';
import DamageTable from './Components/DamageTable';
import CodeGenerator from './CodeGenerator'
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
      power: {},
      upgrades: {},
      currentUnitName: "Infantry",
      currentCOName: "Origin",
      currentFractionName: "League",
      currentUpgradeID: -1,
      isPowerSelect: false,
      isJsonInit: false
    };

    fetch('../data/options.json').then(response => {
      return response.json();
    }).then(data => {
      this.setState(() => ({
        options: data
      }));

      fetch('../data/unitProperties.json').then(response => {
        return response.json();
      }).then(data => {
        this.initJson(data);
      }).catch(error => {
        this.initJson(null);
      });
    });

    this.changeJson = this.changeJson.bind(this);
    this.changeCurrentName = this.changeCurrentName.bind(this);
    this.deleteUpgradeItem = this.deleteUpgradeItem.bind(this);  
    this.addUpgradeItem = this.addUpgradeItem.bind(this);
    this.moveUpgradeItem = this.moveUpgradeItem.bind(this);
    this.changeUpgradeProperty = this.changeUpgradeProperty.bind(this);
  }

  initJson = (data) => {
    let {unitNames, unitProperties, coNames, fractionNames} = this.state.options;

    //Прединициация юнитов
    coNames.forEach((coName) => {
      this.setState(() => ({
        units: {
          ...this.state.units,
          [coName]: {}
        },
        power: {
          ...this.state.power,
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
                  [unitProperty.name]: this.getInitUnitObject(data, "units", coName, unitName, unitProperty)
                }
              }
            },
            power: {
              ...this.state.power,
              [coName]: {
                ...this.state.power[coName],
                [unitName]: {
                  ...this.state.power[coName][unitName],
                  [unitProperty.name]: this.getInitUnitObject(data, "power", coName, unitName, unitProperty)
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
              [unitName]: this.getInitUpgradeArray(data, fractionName, unitName)
            }
          }
        }));
      });
    });

    this.setState(() => ({
      isJsonInit: true
    }));
  }

  getInitUnitObject = (data, typeName, coName, unitName, unitProperty) => {
    var initProperty = {
      value: this.getInitValue(unitProperty.type),
      hasValue: false
    };

    if (data === null || data[typeName] == null) {
      return initProperty;
    }

    let unit = data[typeName].find((item) => item.coName === coName && item.unitName === unitName);
    if (!unit || !unit.stats[unitProperty.name]) {
      return initProperty;
    }

    let dataUnitProperty = unit.stats[unitProperty.name];

    return {
      value: dataUnitProperty.value,
      hasValue: dataUnitProperty.hasValue
    }
  }

  getInitUpgradeArray = (data, fractionName, unitName) => {
    if (data === null) {
      return [];
    }

    let upgrade = data.upgrades.find((item) => item.fractionName === fractionName && item.unitName === unitName);
    if (!upgrade || !upgrade.upgradeList) {
      return [];
    }

    let upgradeArray = upgrade.upgradeList;
    
    this.state.options.unitProperties.forEach((unitProperty) => {
      upgradeArray.forEach((upgradeItem) => {
        //Если нет property, то добавляем
        if (!upgradeItem.unitProperties[unitProperty.name]) {
          upgradeItem.unitProperties[unitProperty.name] = {
            value: this.getInitValue(unitProperty.type),
            hasValue: false
          };
        }
      });
    });

    return upgradeArray;
  }

  getInitValue = (type) => {
    if (type === "int" || type === "enum") {
      return 0;
    }
    if (type === "string") {
      return "";
    }
    if (type === "bool") {
      return false;
    }
  }

  changeJson = (event, typeName, propertyName, isProperty, upgradeNumber) => {
    let fieldName = "value";

    if (!isProperty) {
      fieldName = "hasValue";
    }

    let inputType = event.target.type;
    let inputValue = event.target.value;

    if (inputType === "checkbox") {
      inputValue = event.target.checked;
    }
    else if (inputType === "number") {
      inputValue = parseInt(inputValue);
    }
    else if (inputType === "select-one") {
      inputValue = parseInt(inputValue);
    }

    if (upgradeNumber !== -1) {
      let copyUnits = [...this.state.upgrades[this.state.currentFractionName][this.state.currentUnitName]];
      copyUnits[upgradeNumber]["unitProperties"][propertyName][fieldName] =  inputValue;

      this.setState(() => ({
        upgrades: {
          ...this.state.upgrades,
          [this.state.currentFractionName]: {
            ...this.state.upgrades[this.state.currentFractionName],
            [this.state.currentUnitName]: copyUnits
          }
        }
      }));
    }
    else {
      this.setState(() => ({
        //units или power
        [typeName]: {
          ...this.state[typeName],
          [this.state.currentCOName]: {
            ...this.state[typeName][this.state.currentCOName],
            [this.state.currentUnitName]: {
              ...this.state[typeName][this.state.currentCOName][this.state.currentUnitName],
              [propertyName]: {
                ...this.state[typeName][this.state.currentCOName][this.state.currentUnitName][propertyName],
                [fieldName]: inputValue
              }
            }
          }
        }
      }));
    }

    console.log(this.state);
  }

  changeUpgradeProperty = (event, upgradeNumber, upgradePropertyName) => {
    let inputValue = event.target.value;

    if (upgradePropertyName === "selected") {
      inputValue = event.target.checked;
    }

    let copyUnits = [...this.state.upgrades[this.state.currentFractionName][this.state.currentUnitName]];
    copyUnits[upgradeNumber][upgradePropertyName] = inputValue;

    this.setState(() => ({
      upgrades: {
        ...this.state.upgrades,
        [this.state.currentFractionName]: {
          ...this.state.upgrades[this.state.currentFractionName],
          [this.state.currentUnitName]: copyUnits
        }
      }
    }));
  }

  deleteUpgradeItem = (itemID) => {
    let {currentUnitName, currentFractionName, currentUpgradeID} = this.state;

    if (currentUpgradeID === itemID) {
      this.changeCurrentName(-1, "upgrade");
    }

    this.setState(() => ({
      upgrades: {
        ...this.state.upgrades,
        [currentFractionName]: {
          ...this.state.upgrades[currentFractionName],
          [currentUnitName]: this.state.upgrades[currentFractionName][currentUnitName].filter((item) => (
            item.itemID !== itemID
          ))
        }
      }
    }));

    console.log(this.state);
  }

  getUnitIndex = (unitName) => {
    let {unitNames} = this.state.options;

    for (let i=0; i<unitNames.length; i++) {
      if (unitNames[i] === unitName) {
        return i;
      }
    }
  }

  addUpgradeItem = (rowNumber) => {
    let {currentUnitName, currentFractionName} = this.state;

    let itemID = 1 + this.state.upgrades[currentFractionName][currentUnitName].reduce((prev, curr) => (
      Math.max(prev, curr.itemID)
    ), -1);

    let unitIndex = this.getUnitIndex(currentUnitName) * 6 + itemID;
    let upgradeUnitProperies = {};

    this.state.options.unitProperties.forEach((unitProperty) => {
      upgradeUnitProperies = {
        ...upgradeUnitProperies,
        [unitProperty.name]: {
          value: this.getInitValue(unitProperty.type),
          hasValue: false
        }
      }
    });

    this.setState(() => ({
      upgrades: {
        ...this.state.upgrades,
        [currentFractionName]: {
          ...this.state.upgrades[currentFractionName],
          [currentUnitName]: [
            ...this.state.upgrades[currentFractionName][currentUnitName],
            {
              rowNumber: rowNumber,
              itemID: itemID,
              itemName: "item",
              icon: unitIndex,
              price: 1,
              selected: false,
              unitProperties: upgradeUnitProperies
            }
          ]
        }
      }
    }));

    console.log(this.state);
  }

  changeUpgradeIndex = (indexOld, indexNew) => {
    let copyUnits = [...this.state.upgrades[this.state.currentFractionName][this.state.currentUnitName]];
    //copyUnits[upgradeNumber][upgradePropertyName] = inputValue;

    copyUnits.splice(indexNew, 0, copyUnits.splice(indexOld, 1)[0]);

    this.setState(() => ({
      upgrades: {
        ...this.state.upgrades,
        [this.state.currentFractionName]: {
          ...this.state.upgrades[this.state.currentFractionName],
          [this.state.currentUnitName]: copyUnits
        }
      }
    }));
  }

  moveUpgradeItem = (itemNumber, rowNumber, direction) => {
    switch (direction) {
      case "up":
        this.changeUpgradeProperty({
          target: {
            value: Math.max(0, rowNumber - 1)
          }
        }, itemNumber, "rowNumber");
        break;
      case "down":
        this.changeUpgradeProperty({
          target: {
            value: rowNumber + 1
          }
        }, itemNumber, "rowNumber");
        break;
      case "left":
        this.changeUpgradeIndex(itemNumber, itemNumber - 1);
        break;
      case "right":
        this.changeUpgradeIndex(itemNumber, itemNumber + 1);
        break;
    }
  }

  generateClass = () => {
    CodeGenerator(this.state.options.unitProperties);
  }

  getCalculatedStats = (stats) => {
    let calculatedStats = {};

    for(let key in stats) {
      for(let i=0; i<stats[key].length; i++) {
        let properties = stats[key][i].unitProperties;
        for(let property in properties) {
          if (properties[property].hasValue) {
            if (calculatedStats[property]) {
              calculatedStats[property]++;
            }
            else {
              calculatedStats[property] = 1;
            }
          }
          else {
            if (!calculatedStats[property]) {
              calculatedStats[property] = 0;
            }
          }
        }
      }
    }

    return calculatedStats;
  }

  checkUpgradeStats = () => {
    let league = this.state.upgrades.League;
    let reich = this.state.upgrades.Reich;

    let leagueStats = this.getCalculatedStats(league);
    let reichStats = this.getCalculatedStats(reich);
    let summStats = {};

    for (let key in leagueStats) {
      if (summStats[key]) {
        summStats[key] += leagueStats[key];
      }
      else {
        summStats[key] = leagueStats[key];
      }
    }

    for (let key in reichStats) {
      if (summStats[key]) {
        summStats[key] += reichStats[key];
      }
      else {
        summStats[key] = reichStats[key];
      }
    }

    console.log(summStats);
  }

  generateJson = () => {
    let exportObject = {
      units: [],
      power: [],
      upgrades: []
    };

    let {unitNames, coNames, fractionNames} = this.state.options;

    coNames.forEach((coName) => {
      unitNames.forEach((unitName) => {
        exportObject.units.push({
          "coName": coName,
          "unitName": unitName,
          "stats": this.state.units[coName][unitName]
        });
        exportObject.power.push({
          "coName": coName,
          "unitName": unitName,
          "stats": this.state.power[coName][unitName]
        });
      });
    });

    fractionNames.forEach((fractionName) => {
      unitNames.forEach((unitName) => {
        exportObject.upgrades.push({
          "fractionName": fractionName,
          "unitName": unitName,
          "upgradeList": this.state.upgrades[fractionName][unitName]
        });
      });
    });

    this.downloadObjectAsJson(exportObject, "unitProperties");
  }

  downloadObjectAsJson = (exportObj, exportName) => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  changeCurrentName = (name, type) => {
    if (type === "unit") {
      this.setState(() => ({
        currentUnitName: name,
        currentUpgradeID: -1
      }));
    }
    else if (type === "co") {
      this.setState(() => ({
        currentCOName: name,
        isPowerSelect: (name === "Origin") ? false : this.state.isPowerSelect
      }));
    }
    else if (type === "fraction") {
      this.setState(() => ({
        currentFractionName: name,
        currentUpgradeID: -1
      }));
    }
    else if (type === "upgrade") {
      this.setState(() => ({
        currentUpgradeID: name
      }));
    }
    else if (type === "power") {
      this.setState(() => ({
        isPowerSelect: name
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
          <div className="App-container-block-middle">
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
              deleteUpgradeItem={this.deleteUpgradeItem}
              addUpgradeItem={this.addUpgradeItem}
              changeCurrentName={this.changeCurrentName}
              currentUpgradeID={this.state.currentUpgradeID}
              changeUpgradeProperty={this.changeUpgradeProperty}
            />
            <UpgradeEditor
              isJsonInit={this.state.isJsonInit}
              properties={this.state.options.unitProperties}
              dictionaries={this.state.options.dictionaries}
              fractionName={this.state.currentFractionName}
              unitName={this.state.currentUnitName}
              upgrades={this.state.upgrades}
              currentUpgradeID={this.state.currentUpgradeID}
              changeUpgradeProperty={this.changeUpgradeProperty}
              changeCurrentName={this.changeCurrentName}
              changeJson={this.changeJson}
              moveUpgradeItem={this.moveUpgradeItem}
            />
          </div>
          <Editor
            isJsonInit={this.state.isJsonInit}
            isPowerSelect={this.state.isPowerSelect}
            unitName={this.state.currentUnitName}
            coName={this.state.currentCOName}
            properties={this.state.options.unitProperties}
            units={this.state.units[this.state.currentCOName]}
            power={this.state.power[this.state.currentCOName]}
            dictionaries={this.state.options.dictionaries}
            originUnits={this.state.units["Origin"]}
            changeCurrentName={this.changeCurrentName}
            changeJson={this.changeJson}
          />
        </div>
        <button onClick={this.generateClass}>Generate C# Class</button>
        <button onClick={this.checkUpgradeStats}>Check Upgrade Stats</button>
        <button onClick={this.generateJson}>Download JSON</button>
        <DamageTable
          isJsonInit={this.state.isJsonInit}
          options={this.state.options}
          units={this.state.units}
          upgrades={this.state.upgrades}
        />
      </div>
    );
  }
}

export default App;
