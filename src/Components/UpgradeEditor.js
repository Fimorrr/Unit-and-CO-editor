import React, { Component } from 'react';
import EditorElement from './EditorElement';
import '../App.css';

function UpgradeEditor(props) {

    if (props.currentUpgradeID === -1) {
        return "";
    }

    let itemNumber = -1;
    props.upgrades[props.fractionName][props.unitName].forEach((item, index) => {
        if (item.itemID === props.currentUpgradeID) {
            itemNumber = index;
        }
    });

	return (
		<div className="Upgrade-editor">
            <div>Opened Item: {props.currentUpgradeID}</div>
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
            <button onClick={() => props.changeCurrentName(-1, "upgrade")}>Close</button>
            <ul>
                {props.properties.map((item, index) => (
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

export default UpgradeEditor;