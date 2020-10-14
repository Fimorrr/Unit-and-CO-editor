import React, { Component } from 'react';
import EditorElement from './EditorElement';
import '../App.css';

function UpgradeEditor(props) {

    if (props.currentUpgradeID === -1) {
        return "";
    }

    let itemNumber = -1;
    props.upgrades[props.fractionName][props.unitName].forEach((item, index) => {
        //TODO
    });

	return (
		<div className="Upgrade-editor">
            <div>Upgrade Editor here {props.currentUpgradeID}</div>
			<button onClick={() => props.changeCurrentName(-1, "upgrade")}>Close</button>
            <ul>
                {props.properties.map((item, index) => (
                    <EditorElement
                        propertyName={item.name}
                        propertyType={item.type}
                        dictionary={item.type === "enum" ? props.dictionaries[item.name] : []}
                        itemNumber={itemNumber}
                        property={props.upgrades[props.fractionName][props.unitName][itemNumber]}
                        originProperty={{value: ""}}
                        upgradeNumber={itemNumber}
                        changeJson={props.changeJson}
                    />
                ))}
            </ul>
		</div>
	);
}

export default UpgradeEditor;