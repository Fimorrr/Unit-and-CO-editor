import React, { Component } from 'react';
import EditorElement from './EditorElement';
import FilterPanel from './FilterPanel';
import '../App.css';

class Editor extends Component {
	constructor(props) {
		super(props);

		this.state = {
      filters: {}
    };
  }

  render() {
    let props = this.props;

    if (!props.isJsonInit || props.units == null || props.originUnits == null) {
      return "";
    }

    let unitImgSrc = "../resources/units/" + props.unitName + ".png";
    let coImgSrc = "../resources/co/" + props.coName + ".png";

    let typeName = props.isPowerSelect ? "power" : "units";

    let properties = props.properties;

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
        <FilterPanel/>
        <ul>
          {properties.map((item, index) => (
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
          ))}
        </ul>
      </div>
    );
  }
}

export default Editor;