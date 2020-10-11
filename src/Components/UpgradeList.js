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
					rowNumber={index}
					upgradeItems={item}
					addUpgradeItem={props.addUpgradeItem}
				/>
			))}
			
			<button onClick={() => props.addUpgradeItem(upgradeRows.length)}>Add Row</button>
		</div>
	);
}

export default UpgradeList;