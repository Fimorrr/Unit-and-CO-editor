import React, { Component } from 'react';
import UpgradeRow from './UpgradeRow'
import '../App.css';

function UpgradeList(props) {


	return (
		<div>
			<UpgradeRow
				addUpgradeItem={props.addUpgradeItem}
			/>
			<UpgradeRow
				addUpgradeItem={props.addUpgradeItem}
			/>
			<button>Add Row</button>
		</div>
	);
}

export default UpgradeList;