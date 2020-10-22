import React, { Component } from 'react';
import '../App.css';

class DamageTable extends Component {
  constructor(props) {
		super(props);

		this.state = {
			currentLandscape: 0,
			attackCO: "Origin",
			attackFraction: "League",
			defendCO: "Origin",
			defendFraction: "League"
		}
	}

	changeLandscape = (event, valueName) => {
		let inputValue = event.target.value;

		this.setState(() => ({
			...this.state,
			[valueName]: inputValue
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

	getStats = (coName, fractionName, unitName, upgraded) => {
		let stats = {};
		let coStats = this.props.units[coName][unitName];
		let originStats = this.props.units["Origin"][unitName];
		let fractionStats = this.props.upgrades[fractionName][unitName];

		for (let key in originStats) {
			stats[key] = originStats[key].value;
		}

		for (let key in coStats) {
			if (coStats[key].hasValue) {
				stats[key] = coStats[key].value;
			}
		}

		if (upgraded) {
			fractionStats.forEach((fractionStat) => {
				if (fractionStat.selected) {
					this.props.options.unitProperties.forEach((property) => {
						if (fractionStat.unitProperties[property.name].hasValue) {
							if (property.type === "bool" || property.type === "enum") {
								stats[property.name] = fractionStat.unitProperties[property.name].value;
							}
							else {
								stats[property.name] += fractionStat.unitProperties[property.name].value;
							}
						}
					});
				}
			});
		}

		return stats;
	}

	calculateDamage = (attackUnitName, defendUnitName, ammo, upgraded) => {
		let attackUnit = this.getStats(this.state.attackCO, this.state.attackFraction, attackUnitName, upgraded);
		let defendUnit = this.getStats(this.state.defendCO, this.state.defendFraction, defendUnitName, upgraded);

		let flyCoef = 1;
		let defence = defendUnit.baseDefence;

		let attackHp = 100;
		let defendHp = 100;

		let attack = this.getDigit(attackHp);

		if (defendUnit.movementType !== this.getDictionaryIndex("movementType", "flying")) {
			defence += parseInt(this.state.currentLandscape);
		}

		if (defendUnit.movementType === this.getDictionaryIndex("movementType", "flying")) {
			if (!attackUnit.canAttackHighAir && defendUnit.isHighAir) {
				return "-";
			}
			else if (attackUnit.canAttackFly) {
				flyCoef = attackUnit.flyCoef / 100;
			}
			else if (!attackUnit.canAttackFly) {
				return "-";
			}
		}

		if (attackUnit.uAttack > 0) {
			attack *= attackUnit.uAttack / 10 * ammo * flyCoef;
		}
		else {
			let lAttack = 0;
			let mAttack = 0;
			let hAttack = 0;

			switch (defendUnit.armorType)
			{
				case this.getDictionaryIndex("armorType", "light"):
					lAttack = attackUnit.lAttack * attack / 10;
					mAttack = attackUnit.mAttack * attack / 20 * ammo;
					hAttack = attackUnit.hAttack * attack / 40 * ammo;
					break;
				case this.getDictionaryIndex("armorType", "medium"):
					lAttack = attackUnit.lAttack * attack / 40; 
					mAttack = attackUnit.mAttack * attack / 10 * ammo;
					hAttack = attackUnit.hAttack * attack / 20 * ammo;
					break;
				case this.getDictionaryIndex("armorType", "heavy"):
					lAttack = attackUnit.lAttack * attack / 100; 
					mAttack = attackUnit.mAttack * attack / 35 * ammo;
					hAttack = attackUnit.hAttack * attack / 10 * ammo;
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

		return  parseInt(attack);
	}

	getDamageText = (attackUnitName, defendUnitName) => {
		let ammoDamage = this.calculateDamage(attackUnitName, defendUnitName, 1, false);
		let ammoUpgradedDamage = this.calculateDamage(attackUnitName, defendUnitName, 1, true);
		let noAmmoDamage = this.calculateDamage(attackUnitName, defendUnitName, 0, false);
		let noAmmoUpgradedDamage = this.calculateDamage(attackUnitName, defendUnitName, 0, true);

		if (ammoUpgradedDamage !== noAmmoUpgradedDamage) {
			return (
				<span>
					<span
						className={ammoDamage !== ammoUpgradedDamage ? "Upgrade-item-selected" : ""}>
							{ammoUpgradedDamage}
					</span>
					<span
						className={noAmmoDamage !== noAmmoUpgradedDamage ? "Upgrade-item-selected" : ""}>
							{" (" + noAmmoUpgradedDamage + ")"}
					</span>
				</span>
			);
		}

		return (
			<span
				className={ammoDamage !== ammoUpgradedDamage ? "Upgrade-item-selected" : ""}>
					{ammoUpgradedDamage}
			</span>
		);
	}

  render() {
		if (!this.props.isJsonInit) {
			return "";
		}

		let {unitNames} = this.props.options;

		return (
			<div className="Damage-container">
				<div className="Editor-container">
					<div className="Editor-container-element">Attack CO: </div>
					<select
						className="Editor-input"
						value={this.state.attackCO}
						onChange={(event) => this.changeLandscape(event, "attackCO")}>
						{this.props.options.coNames.map((item, index) => (
							<option value={item}>{item}</option>
						))}
					</select>
				</div>
				<div className="Editor-container">
					<div className="Editor-container-element">Attack Fraction: </div>
					<select
						className="Editor-input"
						value={this.state.attackFraction}
						onChange={(event) => this.changeLandscape(event, "attackFraction")}>
						{this.props.options.fractionNames.map((item, index) => (
							<option value={item}>{item}</option>
						))}
					</select>
				</div>
				<div className="Editor-container">
					<div className="Editor-container-element">Defend CO: </div>
					<select
						className="Editor-input"
						value={this.state.defendCO}
						onChange={(event) => this.changeLandscape(event, "defendCO")}>
						{this.props.options.coNames.map((item, index) => (
							<option value={item}>{item}</option>
						))}
					</select>
				</div>
				<div className="Editor-container">
					<div className="Editor-container-element">Defend Fraction: </div>
					<select
						className="Editor-input"
						value={this.state.defendFraction}
						onChange={(event) => this.changeLandscape(event, "defendFraction")}>
						{this.props.options.fractionNames.map((item, index) => (
							<option value={item}>{item}</option>
						))}
					</select>
				</div>
				<div className="Editor-container">
					<div className="Editor-container-element">Landscape: </div>
					<select
						className="Editor-input"
						value={this.state.currentLandscape}
						onChange={(event) => this.changeLandscape(event, "currentLandscape")}>
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