import React, { Component } from 'react';
import UpgradeItem from './UpgradeItem'
import '../App.css';

function UpgradeRow(props) {


	return (
		<div className="Upgrade-row">
			<UpgradeItem/>
			<UpgradeItem/>
			<UpgradeItem/>
			<button onClick={() => props.addUpgradeItem(0)}>+</button>
		</div>
	);
}

export default UpgradeRow;