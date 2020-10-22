import React, { Component } from 'react';
import '../App.css';

function UpgradeItem(props) {

	let itemNumber = -1;
	props.upgrades[props.fractionName][props.unitName].forEach((item, index) => {
        if (item.itemID === props.item.itemID) {
            itemNumber = index;
        }
    });

	return (
		<div className="Upgrade-item">
			<div className={props.item.selected ? "Upgrade-item-selected" : ""} onClick={() => props.changeCurrentName(props.item.itemID, "upgrade")}>
			{props.item.itemName} ({props.item.itemID})
			</div>
			<input 
				type="checkbox" 
				checked={props.item.selected} 
				onChange={(event) => props.changeUpgradeProperty(event, itemNumber, "selected")}/>
			<button
				onClick={() => props.deleteUpgradeItem(props.item.itemID)}
				className="Upgrade-item-delete"
			>x</button>
		</div>
	);
}

export default UpgradeItem;