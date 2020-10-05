import React from 'react';
import logo from './logo.svg';
import './App.css';
import options from './options.json'

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <UnitList
          names={options.unitNames}
        />
        <Editor
          properties={options.unitProperties}
        />
      </div>
    </div>
  );
}

function UnitList(props) {
  return (
    <div className="App-container-block">
      <ul>
        {props.names.map((item, index) => (
          <ListElement
            name={item}
          />
        ))}
      </ul>
    </div>
  );
}

function ListElement(props) {
  let imgSrc = "../resources/units/" + props.name + ".png";

  return (
    <li>
      <img src={imgSrc} width="30px" height="30px"/>
      {props.name}
    </li>
  );
}

function Editor(props) {
  return (
    <div className="App-container-block">
      <ul>
        {props.properties.map((item, index) => (
          <EditorElement
            name={item.name}
          />
        ))}
      </ul>
    </div>
  );
}

function EditorElement(props) {
  return (
    <li className="Editor-container">
      <div class="Editor-container-element">{props.name}</div>
      <input class="Editor-container-element"/>
    </li>
  );
}

export default App;
