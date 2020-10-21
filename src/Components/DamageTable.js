import React, { Component } from 'react';
import '../App.css';

class DamageTable extends Component {
  constructor(props) {
		super(props);

		this.state = {
			currentLandscape: 0
		}
	}

	changeLandscape = (event) => {
		let inputValue = parseInt(event.target.value);

		this.setState(() => ({
			currentLandscape: inputValue
		}));
	}

	getDictionaryIndex = (dictionaryName, value) => {
		let dictionary = this.props.options.dictionaries[dictionaryName];

		for (let i=0; i<dictionary.length; i++) {
			if (dictionary[i] === value) {
				return i;
			}
		}

		return -1;
	}

	getDigit = (hp) => {
		let intHp = (hp + 9) / 10;
		return parseInt(intHp);
	}

	calculateDamage = (attackUnitName, defendUnitName, ammo) => {
		let attackUnit = this.props.units["Origin"][attackUnitName];
		let defendUnit = this.props.units["Origin"][defendUnitName];

		let flyCoef = 1;
		let defence = defendUnit.baseDefence.value;

		let attackHp = 100;
		let defendHp = 100;

		let attack = this.getDigit(attackHp);

		if (defendUnit.movementType.value !== this.getDictionaryIndex("movementType", "flying")) {
			defence += this.state.currentLandscape;
		}

		if (defendUnit.movementType.value === this.getDictionaryIndex("movementType", "flying")) {
			if (!attackUnit.canAttackHighAir.value && defendUnit.isHighAir.value) {
				return "-";
			}
			else if (attackUnit.canAttackFly.value) {
				flyCoef = attackUnit.flyCoef.value / 100;
			}
			else if (!attackUnit.canAttackFly.value) {
				return "-";
			}
		}


		if (attackUnit.uAttack.value > 0) {
			attack *= attackUnit.uAttack.value / 10 * ammo * flyCoef;
		}
		else {
			let lAttack = 0;
			let mAttack = 0;
			let hAttack = 0;

			switch (defendUnit.armorType.value)
			{
					case this.getDictionaryIndex("armorType", "light"):
							lAttack = attackUnit.lAttack.value * attack / 10;
							mAttack = attackUnit.mAttack.value * attack / 20 * ammo;
							hAttack = attackUnit.hAttack.value * attack / 40 * ammo;
							break;
					case this.getDictionaryIndex("armorType", "medium"):
							lAttack = attackUnit.lAttack.value * attack / 40; 
							mAttack = attackUnit.mAttack.value * attack / 10 * ammo;
							hAttack = attackUnit.hAttack.value * attack / 20 * ammo;
							break;
					case this.getDictionaryIndex("armorType", "heavy"):
							lAttack = attackUnit.lAttack.value * attack / 100; 
							mAttack = attackUnit.mAttack.value * attack / 35 * ammo;
							hAttack = attackUnit.hAttack.value * attack / 10 * ammo;
							break;
			}

			lAttack *= flyCoef;
			mAttack *= flyCoef;
			hAttack *= flyCoef;

			if (lAttack > mAttack && lAttack > hAttack)
			{
				attack = lAttack;
			}
			else if (mAttack > lAttack && mAttack > hAttack)
			{
				attack = mAttack;
			}
			else if (hAttack > lAttack && hAttack > mAttack)
			{
				attack = hAttack;
			}
			else
			{
				attack = 0;
			}
		}

		attack = attack * (120 - defence * this.getDigit(defendHp)) / 100;

		return parseInt(attack);
	}

	getDamageText = (attackUnitName, defendUnitName) => {
		let ammoDamage = this.calculateDamage(attackUnitName, defendUnitName, 1);
		let noAmmoDamage = this.calculateDamage(attackUnitName, defendUnitName, 0);

		if (ammoDamage !== noAmmoDamage) {
			return ammoDamage + " (" + noAmmoDamage + ")";
		}

		return ammoDamage;
	}

  render() {
		if (!this.props.isJsonInit) {
			return "";
		}

		let {unitNames} = this.props.options;

		return (
			<div className="Damage-container">
				<div>
					<select
						className="Editor-input"
						value={this.state.currentLandscape}
						onChange={(event) => this.changeLandscape(event)}>
						{this.props.options.dictionaries.landscape.map((item, index) => (
							<option value={index}>{item}</option>
						))}
					</select>
				</div>
				<table className="Damage-table">
					<tr>
						<td/>
						{unitNames.map((unitName) => (
							<td>
								<img src={"../resources/units/" + unitName + ".png"} width="30px" height="30px" />
							</td>
						))}
					</tr>
					{unitNames.map((defendUnitName) => {
						return (
							<tr>
								<td>
									<img src={"../resources/units/" + defendUnitName + ".png"} width="30px" height="30px" />
								</td>
								{unitNames.map((attackUnitName) => (
									<td>
										{this.getDamageText(attackUnitName, defendUnitName)}
									</td>
								))}
							</tr>
						)
					})}
				</table>
			</div>
		);
	}
}

export default DamageTable;