import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        unitNames: ["Infantry"],
        unitProperties: [],
        coNames: []
      }
    };

    fetch('../data/options.json').then(response => {
      console.log(response);
      return response.json();
    }).then(data => {
      // Work with JSON data here
      console.log(data);
      this.setState(() => ({
        options: data
      }));
    }).catch(err => {
      // Do something for an error here
      console.log("Error Reading data " + err);
    });

  }

  render() {
    return (
      <div className="App">
        <div className="App-container">
          <UnitList
            names={this.state.options.unitNames}
          />
          <Editor
            properties={this.state.options.unitProperties}
          />
        </div>
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
