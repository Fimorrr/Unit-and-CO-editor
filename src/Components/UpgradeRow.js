import React, { Component } from 'react';
import UpgradeItem from './UpgradeItem'
import '../App.css';

function UpgradeRow(props) {


	return (
		<div className="Upgrade-row">
			{props.upgradeItems.map((item, index) => (
				<UpgradeItem/>
			))}
			<button onClick={() => props.addUpgradeItem(props.rowNumber)}>+</button>
		</div>
	);
}

export default UpgradeRow;