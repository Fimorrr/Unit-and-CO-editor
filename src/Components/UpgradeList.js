import React, { Component } from 'react';
import UpgradeRow from './UpgradeRow'
import '../App.css';

function UpgradeList(props) {
	if (!props.isJsonInit) {
		return "";
	}

	let upgradeList = props.upgrades[props.fractionName][props.unitName];
	let upgradeRows = [];

	upgradeList.forEach((upgrade) => {
		upgradeRows[upgrade.rowNumber] = [];
	});

	upgradeList.forEach((upgrade) => {
		upgradeRows[upgrade.rowNumber] = [
			...upgradeRows[upgrade.rowNumber],
			upgrade
		];
	});

	return (
		<div>
			{upgradeRows.map((item, index) => (
				<UpgradeRow
					unitName={props.unitName}
					fractionName={props.fractionName}
					rowNumber={index}
					upgradeItems={item}
					upgrades={props.upgrades}
					addUpgradeItem={props.addUpgradeItem}
					deleteUpgradeItem={props.deleteUpgradeItem}
					changeCurrentName={props.changeCurrentName}
					currentUpgradeID={props.currentUpgradeID}
					changeUpgradeProperty={props.changeUpgradeProperty}
				/>
			))}
			
			<button onClick={() => props.addUpgradeItem(upgradeRows.length)}>Add Row</button>
		</div>
	);
}

export default UpgradeList;