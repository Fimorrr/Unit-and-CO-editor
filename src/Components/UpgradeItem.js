import React, { Component } from 'react';
import '../App.css';

function UpgradeItem(props) {


	return (
		<div className="Upgrade-item">
			Item
			<button
				onClick={() => props.deleteUpgradeItem(props.item.itemID)}
				className="Upgrade-item-delete"
			>x</button>
		</div>
	);
}

export default UpgradeItem;