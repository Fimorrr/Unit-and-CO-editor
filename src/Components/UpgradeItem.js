import React, { Component } from 'react';
import '../App.css';

function UpgradeItem(props) {

	let itemNumber = -1;
	props.upgrades[props.fractionName][props.unitName].forEach((item, index) => {
        if (item.itemID === props.item.itemID) {
            itemNumber = index;
        }
    });

	let iconImage = props.fractionName == "League" ? "icons_league_land" : "icons_reich_land";

	return (
		<div className="Upgrade-item">
			<div className="Upgrade-item-header">
				<div
					className={"Upgrade-item-header-text Like-link " + (props.item.itemID === props.currentUpgradeID ? "Upgrade-item-selected Upgrade" : "")}
					onClick={() => props.changeCurrentName(props.item.itemID, "upgrade")}
				>
					{props.item.itemName}
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
			<div
				className="Upgrade-item-body"
				onClick={() => props.changeCurrentName(props.item.itemID, "upgrade")}
			>
				<div className="Upgrade-item-image-container">
					<div
						style={{
							width: "180px",
							height: "40px",
							marginRight: "10px",
							objectFit: "contain",
							background: `url(../resources/icons/${iconImage}.png) ${-30 * (props.item.icon % 6)}px ${-30 * parseInt(props.item.icon / 6)}px / cover no-repeat`
						}}
					/>
				</div>
				<div>id: {props.item.itemID}, icon: {props.item.icon}, price: {props.item.price}</div>
			</div>	
		</div>
	);
}

export default UpgradeItem;