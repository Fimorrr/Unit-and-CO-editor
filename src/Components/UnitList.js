import React, { Component } from 'react';
import ListElement from './ListElement';
import '../App.css';

function UnitList(props) {
	return (
		<div class="Unit-list">
			<ul>
				{props.names.map((item, index) => (
					<ListElement
						name={item}
						type={props.type}
						isSelected={props.currentName === item}
						changeCurrentName={props.changeCurrentName}
					/>
				))}
			</ul>
		</div>
	);
}

export default UnitList;