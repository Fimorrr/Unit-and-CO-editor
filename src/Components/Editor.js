import React, { Component } from 'react';
import EditorElement from './EditorElement';
import '../App.css';

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
            upgradeNumber={-1}
            changeJson={props.changeJson}
          />
        ))}
      </ul>
    </div>
  );
}

export default Editor;