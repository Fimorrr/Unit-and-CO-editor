import React, { Component } from 'react';
import UpgradeItem from './UpgradeItem'
import '../App.css';

function UpgradeRow(props) {


	return (
		<div className="Upgrade-row">
			{props.upgradeItems.map((item, index) => (
				<UpgradeItem
					unitName={props.unitName}
					fractionName={props.fractionName}
					upgrades={props.upgrades}
					rowNumber={props.rowNumber}
					itemNumber={index}
					item={props.upgradeItems[index]}
					deleteUpgradeItem={props.deleteUpgradeItem}
					changeCurrentName={props.changeCurrentName}
					currentUpgradeID={props.currentUpgradeID}
					changeUpgradeProperty={props.changeUpgradeProperty}
				/>
			))}
			<button onClick={() => props.addUpgradeItem(props.rowNumber)}>+</button>
		</div>
	);
}

export default UpgradeRow;