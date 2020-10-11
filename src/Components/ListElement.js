import React, { Component } from 'react';
import '../App.css';

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

export default ListElement;