import React, { Component } from 'react';
import EditorElement from './EditorElement';
import FilterPanel from './FilterPanel';
import '../App.css';

class Editor extends Component {
	constructor(props) {
		super(props);

		this.state = {
      filters: {},
      search: "",
      showAll: false
    };
  }

  changeSearch = (event) => {
    let inputValue = event.target.value;

    this.setState(() => ({
      search: inputValue
    }));
  }

  changeShowAll = (event) => {
    let inputValue = event.target.checked;

    this.setState(() => ({
      showAll: inputValue
    }));
  }

  render() {
    let props = this.props;

    if (!props.isJsonInit || props.units == null || props.originUnits == null) {
      return "";
    }

    let unitImgSrc = "resources/units/" + props.unitName + ".png";
    let coImgSrc = "resources/co/" + props.coName + ".png";

    let typeName = props.isPowerSelect ? "power" : "units";

    let properties = props.properties.filter((property) => (
      property.name.toLowerCase().includes(this.state.search.toLowerCase())
    ));

    return (
      <div className="App-container-block-editor">
        <div className="Editor-header">
          <div className="Editor-header-element-left">
            <div>{props.unitName}</div>
            <img src={unitImgSrc} width="100px" height="100px" />
          </div>
          <div className="Editor-header-element-right">
            <div>{props.coName}</div>
            <img src={coImgSrc} width="100px" height="100px" />
          </div>
        </div>
        {props.coName === "Origin" ? "" :
          (<div className="Editor-container">
            <div className="Editor-container-element">CO Power: </div>
            <input 
              className="Editor-input"
              type="checkbox" 
              checked={props.isPowerSelect}
              onChange={(event) => props.changeCurrentName(event.target.checked, "power")}/>
          </div>)
        }
        <div className="Editor-container">
          <div className="Editor-container-element">Show all: </div>
            <input 
              className="Editor-input"
              type="checkbox"
              checked={this.state.showAll}
              onChange={this.changeShowAll}/>
        </div>
        <div className="Editor-container">
          <div className="Editor-container-element">Search: </div>
            <input 
              className="Editor-input"
              value={this.state.search}
              onChange={this.changeSearch}/>
        </div>
        <FilterPanel/>
        <ul>
          {properties.map((item, index) => {
            if (!this.state.showAll && index > 15) {
              return "";
            }

            return (
              <EditorElement
                coName={props.coName}
                propertyName={item.name}
                propertyType={item.type}
                dictionary={item.type === "enum" ? props.dictionaries[item.name] : []}
                property={props[typeName][props.unitName][item.name]}
                originProperty={props.isPowerSelect ? {value: ""} : props.originUnits[props.unitName][item.name]}
                upgradeNumber={-1}
                typeName={typeName}
                changeJson={props.changeJson}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Editor;