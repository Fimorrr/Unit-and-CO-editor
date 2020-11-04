import React, { Component } from 'react';
import '../App.css';

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
          onChange={(event) => props.changeJson(event, props.typeName, props.propertyName, true, props.upgradeNumber)}>
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
          checked={hasNotOwnValue ? props.originProperty.value : props.property.value}
          disabled={hasNotOwnValue}
          onChange={(event) => props.changeJson(event, props.typeName, props.propertyName, true, props.upgradeNumber)} />
      )
    }
    else {
      control = (
        <input
          className="Editor-input"
          type={props.propertyType === "int" ? "number" : "text"}
          value={hasNotOwnValue ? props.originProperty.value : props.property.value}
          disabled={hasNotOwnValue}
          onChange={(event) => props.changeJson(event, props.typeName, props.propertyName, true, props.upgradeNumber)} />
      )
    }
  
    return (
      <li className="Editor-container">
        <div className="Editor-container-element">{props.propertyName}</div>
        {isNotOrigin ? <input type="checkbox" checked={props.property.hasValue} onChange={(event) => props.changeJson(event, props.typeName, props.propertyName, false, props.upgradeNumber)} /> : ""}
        {control}
      </li>
    );
  }

  export default EditorElement;