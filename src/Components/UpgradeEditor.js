import React, { Component } from 'react';
import EditorElement from './EditorElement';
import '../App.css';

class UpgradeEditor extends Component {
	constructor(props) {
        super(props);

        this.state = {
            selectedProperty: "0",
            searchProperty: ""
        };

        this.getItemNumber = this.getItemNumber.bind(this);
        this.changeProperty = this.changeProperty.bind(this);
        this.addProperty = this.addProperty.bind(this);
        this.changeSearchProperty = this.changeSearchProperty.bind(this);
    }

    getItemNumber = () => {
        let itemNumber = -1;
        this.props.upgrades[this.props.fractionName][this.props.unitName].forEach((item, index) => {
            if (item.itemID === this.props.currentUpgradeID) {
                itemNumber = index;
            }
        });

        return itemNumber;
    }

    changeProperty = (event) => {
        let inputValue = event.target.value;

        this.setState(() => ({
            selectedProperty: inputValue
        }));
    }

    changeSearchProperty = (event) => {
        let inputValue = event.target.value;

        this.setState(() => ({
            searchProperty: inputValue
        }));
    }

    addProperty = () => {
        let itemNumber = this.getItemNumber();
        let item = this.props.properties[this.state.selectedProperty];
        let event = {
            target: {
                type: "checkbox",
                checked: true
            }
        };

        this.props.changeJson(event, "", item.name, false, itemNumber);
    }

    render() {
        let props = this.props;

        if (props.currentUpgradeID === -1) {
            return "";
        }

        let itemNumber = this.getItemNumber();
        let rowNumber = props.upgrades[props.fractionName][props.unitName][itemNumber].rowNumber;

        let properties = props.properties.filter((property) => (
            property.name.toLowerCase().includes(this.state.searchProperty.toLowerCase())
        ));

        let addedProperties = props.properties.filter((property) => {
            return props.upgrades[props.fractionName][props.unitName][itemNumber]["unitProperties"][property.name].hasValue;
        });

        return (
            <div className="Upgrade-editor">
                <div className="Editor-container">
                    <div className="Editor-container-element">Opened Item: {props.currentUpgradeID}</div>
                    <button className="Editor-input" onClick={() => props.changeCurrentName(-1, "upgrade")}>Close</button>
                </div>
                <div className="Editor-container">
                    <div className="Editor-container-element">Item Name: </div>
                    <input 
                        className="Editor-input"
                        type="text" 
                        value={props.upgrades[props.fractionName][props.unitName][itemNumber].itemName} 
                        onChange={(event) => props.changeUpgradeProperty(event, itemNumber, "itemName")}/>
                </div>
                <div className="Editor-container">
                    <div className="Editor-container-element">Icon: </div>
                    <input 
                        className="Editor-input"
                        type="number" 
                        value={props.upgrades[props.fractionName][props.unitName][itemNumber].icon} 
                        onChange={(event) => props.changeUpgradeProperty(event, itemNumber, "icon")}/>
                </div>
                <div className="Editor-container">
                    <div className="Editor-container-element">Price: </div>
                    <input 
                        className="Editor-input"
                        type="number" 
                        value={props.upgrades[props.fractionName][props.unitName][itemNumber].price} 
                        onChange={(event) => props.changeUpgradeProperty(event, itemNumber, "price")}/>
                </div>
                <div className="Editor-container">
                    <div className="Editor-container-element">Selected: </div>
                    <input 
                        className="Editor-input"
                        type="checkbox" 
                        checked={props.upgrades[props.fractionName][props.unitName][itemNumber].selected} 
                        onChange={(event) => props.changeUpgradeProperty(event, itemNumber, "selected")}/>
                </div>
                <div className="Editor-container">
                    <div className="Editor-container-element">Move: </div>
                    <div className="Editor-input-container">
                        <button onClick={() => props.moveUpgradeItem(itemNumber, rowNumber, "up")}>&#8593;</button>
                        <button onClick={() => props.moveUpgradeItem(itemNumber, rowNumber, "down")}>&#8595;</button>
                        <button onClick={() => props.moveUpgradeItem(itemNumber, rowNumber, "left")}>&#8592;</button>
                        <button onClick={() => props.moveUpgradeItem(itemNumber, rowNumber, "right")}>&#8594;</button>
                    </div>
                </div>
                <div className="Editor-container">
                    <div className="Editor-container-element">Search Property: </div>
                    <input 
                        className="Editor-input"
                        type="text" 
                        value={this.state.searchProperty} 
                        onChange={(event) => this.changeSearchProperty(event)}/>
                </div>
                <div className="Editor-container">
                    <div className="Editor-container-element">Add Property: </div>
                    <div className="Editor-input-container">
                        <select
                            className="Editor-input-small"
                            value={this.state.selectedProperty}
                            onChange={(event) => this.changeProperty(event)}>
                            {properties.map((item, index) => (
                                <option value={index}>{item.name}</option>
                            ))}
                        </select>
                        <button onClick={this.addProperty}>+</button>
                    </div>
                </div>
                <ul>
                    {addedProperties.map((item, index) => (
                        <EditorElement
                            propertyName={item.name}
                            propertyType={item.type}
                            dictionary={item.type === "enum" ? props.dictionaries[item.name] : []}
                            itemNumber={itemNumber}
                            property={props.upgrades[props.fractionName][props.unitName][itemNumber]["unitProperties"][item.name]}
                            originProperty={{value: ""}}
                            upgradeNumber={itemNumber}
                            changeJson={props.changeJson}
                        />
                    ))}
                </ul>
            </div>
        );
    }
}

export default UpgradeEditor;