import React, { Component } from 'react';
import '../App.css';

class DamageTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showWeight: false,
			attackCO: "Origin",
			attackFraction: "League",
			attackHp: 100,
			attackLandscape: 0,
			attackRank: 0,
			attackSupportAllyCount: 0,
			attackSupportEnemyCount: 0,
			defendCO: "Origin",
			defendFraction: "League",
			defendHp: 100,
			defendLandscape: 0,
			defendRank: 0,
			defendSupportAllyCount: 0,
			defendSupportEnemyCount: 0,
		}
	}

	changeProperty = (event, valueName) => {
		let inputType = event.target.type;
		let inputValue = event.target.value;
		
		if (inputType === "checkbox") {
			inputValue = event.target.checked;
		}

		if (inputType === "number") {
			inputValue = parseInt(inputValue);
		}

		this.setState(() => ({
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

	calculateDamage = (attackUnitName, defendUnitName, attackHp, defendHp, ammo, upgraded) => {
		let attackUnit = this.getStats(this.state.attackCO, this.state.attackFraction, attackUnitName, upgraded);
		let defendUnit = this.getStats(this.state.defendCO, this.state.defendFraction, defendUnitName, upgraded);

		let defence = defendUnit.baseDefence;
		
		let bloodlustAttackCoef = 1;
		let bloodlustDefenceCoef = 1;
		let landscapeAttackCoef = 1;
		let landscapeDefenceCoef = 1;
		let allyAttackSupportCoef = 1;
		let allyDefenceSupportCoef = 1;
		let enemyAttackSupportCoef = 1;
		let enemyDefenceSupportCoef = 1;
		let divisionAttackCoef = 1;
		let divisionDefenceCoef = 1;
		let rankAttackCoef = 1;
		let rankDefenceCoef = 1;
		let overallAttackCoef = 1;
		let overallDefenceCoef = 1;

		if (attackHp <= 50) {
			bloodlustAttackCoef += attackUnit.bloodlustAttackBonus / 100;
		}
		if (defendHp <= 50) {
			bloodlustDefenceCoef -= defendUnit.bloodlustDefenceBonus / 100;
		}

		let attack = this.getDigit(attackHp);

		if (defendUnit.movementType !== this.getDictionaryIndex("movementType", "flying")) {
			defence += parseInt(this.state.defendLandscape);
		}

		//Если дорога
		if (parseInt(this.state.attackLandscape) === 0) {
			landscapeAttackCoef += attackUnit.roadAttackBonus / 100;	
		}
		if (parseInt(this.state.defendLandscape) === 0) {
			landscapeDefenceCoef -= defendUnit.roadDefenceBonus / 100;
		}
		//Если лес
		if (parseInt(this.state.attackLandscape) === 2) {
			landscapeAttackCoef += attackUnit.woodAttackBonus / 100;
		}
		if (parseInt(this.state.defendLandscape) === 2) {
			landscapeDefenceCoef -= defendUnit.woodDefenceBonus / 100;
		}

		allyAttackSupportCoef += this.state.attackSupportAllyCount * attackUnit.allySupportAttackBonus / 100;
		allyDefenceSupportCoef -= this.state.defendSupportAllyCount * defendUnit.allySupportDefenceBonus / 100;
		enemyAttackSupportCoef += this.state.attackSupportEnemyCount * attackUnit.enemySupportAttackBonus / 100;
		enemyDefenceSupportCoef -= this.state.defendSupportEnemyCount * defendUnit.enemySupportDefenceBonus / 100;

		switch (defendUnit.division) {
			case this.getDictionaryIndex("division", "infantry"):
				divisionAttackCoef += attackUnit.infantryAttackBonus / 100;
				break;
			case this.getDictionaryIndex("division", "tech"):
				divisionAttackCoef += attackUnit.techAttackBonus / 100;
				break;
			case this.getDictionaryIndex("division", "ship"):
				divisionAttackCoef += attackUnit.shipAttackBonus / 100;
				break;
			case this.getDictionaryIndex("division", "plane"):
				divisionAttackCoef += attackUnit.planeAttackBonus / 100;
				break;
			case this.getDictionaryIndex("division", "monster"):
				divisionAttackCoef += attackUnit.monsterAttackBonus / 100;
				break;
		}
		
		switch (attackUnit.division) {
			case this.getDictionaryIndex("division", "infantry"):
				divisionDefenceCoef -= defendUnit.infantryDefenceBonus / 100;
				break;
			case this.getDictionaryIndex("division", "tech"):
				divisionDefenceCoef -= defendUnit.techDefenceBonus / 100;
				break;
			case this.getDictionaryIndex("division", "ship"):
				divisionDefenceCoef -= defendUnit.shipDefenceBonus / 100;
				break;
			case this.getDictionaryIndex("division", "plane"):
				divisionDefenceCoef -= defendUnit.planeDefenceBonus / 100;
				break;
			case this.getDictionaryIndex("division", "monster"):
				divisionDefenceCoef -= defendUnit.monsterDefenceBonus / 100;
				break;
		}

		if (defendUnit.division === this.getDictionaryIndex("division", "plane")) {
			if (!attackUnit.canAttackHighAir && defendUnit.isHighAir) {
				return "-";
			}
			else if (!attackUnit.canAttackFly) {
				return "-";
			}

			if (attackUnit.isAntiAir) {
				divisionDefenceCoef = 1 - defendUnit.antiAirDefenceBonus / 100;
			}
		}

		switch (parseInt(this.state.attackRank)) {
			case this.getDictionaryIndex("rank", "level1"):
				rankAttackCoef += 5 / 100;
				break;
			case this.getDictionaryIndex("rank", "level2"):
				rankAttackCoef += 10 / 100;
				break;
			case this.getDictionaryIndex("rank", "level3"):
				rankAttackCoef += 20 / 100;
				break;
		}

		switch (parseInt(this.state.defendRank)) {
			case this.getDictionaryIndex("rank", "level1"):
				rankDefenceCoef -= 5 / 100;
				break;
			case this.getDictionaryIndex("rank", "level2"):
				rankDefenceCoef -= 10 / 100;
				break;
			case this.getDictionaryIndex("rank", "level3"):
				rankDefenceCoef -= 20 / 100;
				break;
		}

		overallAttackCoef += attackUnit.overallAttackBonus / 100;
		overallDefenceCoef -= defendUnit.overallDefenceBonus / 100;

		let attackCoef = bloodlustAttackCoef * bloodlustDefenceCoef * landscapeAttackCoef * landscapeDefenceCoef * allyAttackSupportCoef * allyDefenceSupportCoef * enemyAttackSupportCoef * enemyDefenceSupportCoef *divisionAttackCoef * divisionDefenceCoef * overallAttackCoef * overallDefenceCoef * rankAttackCoef * rankDefenceCoef;

		if (attackUnit.uAttack > 0) {
			attack *= attackUnit.uAttack / 10 * ammo * attackCoef;
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

			lAttack *= attackCoef;
			mAttack *= attackCoef;
			hAttack *= attackCoef;

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

		//attack = attack * (120 - defence * this.getDigit(defendHp)) / 100;
		var digit = this.getDigit(defendHp);
		var defenceCoef = (1.2 - Math.min(1, defence / 15)) * (1.527 - Math.sqrt(digit) / 6);
		attack = attack * defenceCoef;

		return  parseInt(attack);
	}

	getAttackArmorDurability = (attackUnit, defendUnit) => {
		if (defendUnit.movementType == this.getDictionaryIndex("movementType", "flying") && attackUnit.isAntiAir) {
			return 1500;
		}
		
		if (attackUnit.uAttack > 0) {
			return 600;
		}

		if (defendUnit.armorType == this.getDictionaryIndex("armorType", "light") && attackUnit.lAttack > 0) {
			return 500;
		}

		if (defendUnit.armorType == this.getDictionaryIndex("armorType", "medium") && attackUnit.mAttack > 0) {
			return 500;
		}

		if (defendUnit.armorType == this.getDictionaryIndex("armorType", "heavy")) {
			if (attackUnit.hAttack > 0) {
				return 500;
			}
			if (attackUnit.mAttack > 0) {
				return 300;
			}
		}

		if (attackUnit.lAttack > 0 || attackUnit.mAttack > 0 || attackUnit.hAttack > 0) {
			return 270;
		}

		return 0;
	}

	getWeightOfAttack = (attackUnitName, defendUnitName, attackHp, defendHp) => {
		let attackUnit = this.getStats(this.state.attackCO, this.state.attackFraction, attackUnitName, true);
		let defendUnit = this.getStats(this.state.defendCO, this.state.defendFraction, defendUnitName, true);

		let delta = this.calculateDamage(attackUnitName, defendUnitName, attackHp, defendHp, 1, true);

		if (isNaN(delta)) {
			return {
				result: "-",
				counter: "-"
			};
		}

		delta = Math.min(delta, defendHp);
		let result = delta * defendUnit.price / 100;
		let resultCounter = 0;

		if (delta > 0 && defendUnit.canCounterAttack && defendHp - delta > 0 && attackUnit.attackInnerRad == 0) {
			let counterDelta = this.calculateDamage(defendUnitName, attackUnitName, defendHp - delta, attackHp, 1, true);

			if (!isNaN(counterDelta)) {
				counterDelta = Math.min(counterDelta, attackHp);
				let counter = counterDelta * attackUnit.price / 100;

				result -= counter;
				resultCounter = counter;
			}
		}

		if (delta / defendHp >= 0.14) {
			result += this.getAttackArmorDurability(defendUnit, attackUnit);
		}
		//result -= this.getAttackArmorDurability(attackUnit, defendUnit) / 5 * 4;

		return {
			result: result,
			counter: resultCounter
		};
	}

	getDamageText = (attackUnitName, defendUnitName) => {
		let attackHp = this.state.attackHp;
		let defendHp = this.state.defendHp;
		
		let ammoDamage = this.calculateDamage(attackUnitName, defendUnitName, attackHp, defendHp, 1, false);
		let ammoUpgradedDamage = this.calculateDamage(attackUnitName, defendUnitName, attackHp, defendHp, 1, true);
		let noAmmoDamage = this.calculateDamage(attackUnitName, defendUnitName, attackHp, defendHp, 0, false);
		let noAmmoUpgradedDamage = this.calculateDamage(attackUnitName, defendUnitName, attackHp, defendHp, 0, true);

		let weight = this.getWeightOfAttack(attackUnitName, defendUnitName, attackHp, defendHp);

		if (this.state.showWeight) {
			return (
				<span>
					<span>
						{weight.result}
					</span>
					<span className={weight.result < weight.counter ? "Upgrade-item-selected" : ""}>
						{" (" + weight.counter + ")"}
					</span>
				</span>
			);
		}

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
					{ammoUpgradedDamage }
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
				<span>Show weight: </span>
				<input 
					className="Editor-input"
					type="checkbox" 
					checked={this.state.showWeight} 
					onChange={(event) => this.changeProperty(event, "showWeight")}/>
				<div className="Damage-container-options">
					<div>
						<div className="Editor-container">
							<div className="Editor-container-element">Attack CO: </div>
							<select
								className="Editor-input"
								value={this.state.attackCO}
								onChange={(event) => this.changeProperty(event, "attackCO")}>
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
								onChange={(event) => this.changeProperty(event, "attackFraction")}>
								{this.props.options.fractionNames.map((item, index) => (
									<option value={item}>{item}</option>
								))}
							</select>
						</div>
						<div className="Editor-container">
							<div className="Editor-container-element">Attack HP: </div>
							<input
								className="Editor-input"
								type="number"
								value={this.state.attackHp}
								onChange={(event) => this.changeProperty(event, "attackHp")}/>
						</div>
						<div className="Editor-container">
							<div className="Editor-container-element">Landscape: </div>
							<select
								className="Editor-input"
								value={this.state.attackLandscape}
								onChange={(event) => this.changeProperty(event, "attackLandscape")}>
								{this.props.options.dictionaries.landscape.map((item, index) => (
									<option value={index}>{item}</option>
								))}
							</select>
						</div>
						<div className="Editor-container">
							<div className="Editor-container-element">Rank: </div>
							<select
								className="Editor-input"
								value={this.state.attackRank}
								onChange={(event) => this.changeProperty(event, "attackRank")}>
								{this.props.options.dictionaries.rank.map((item, index) => (
									<option value={index}>{item}</option>
								))}
							</select>
						</div>
						<div className="Editor-container">
							<div className="Editor-container-element">Support Ally Count: </div>
							<select
								className="Editor-input"
								value={this.state.attackSupportAllyCount}
								onChange={(event) => this.changeProperty(event, "attackSupportAllyCount")}>
								{[0, 1, 2, 3, 4].map((item, index) => (
									<option value={item}>{item}</option>
								))}
							</select>
						</div>
						<div className="Editor-container">
							<div className="Editor-container-element">Support Enemy Count: </div>
							<select
								className="Editor-input"
								value={this.state.attackSupportEnemyCount}
								onChange={(event) => this.changeProperty(event, "attackSupportEnemyCount")}>
								{[0, 1, 2, 3, 4].map((item, index) => (
									<option value={item}>{item}</option>
								))}
							</select>
						</div>
					</div>
					<div>
						<div className="Editor-container">
							<div className="Editor-container-element">Defend CO: </div>
							<select
								className="Editor-input"
								value={this.state.defendCO}
								onChange={(event) => this.changeProperty(event, "defendCO")}>
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
								onChange={(event) => this.changeProperty(event, "defendFraction")}>
								{this.props.options.fractionNames.map((item, index) => (
									<option value={item}>{item}</option>
								))}
							</select>
						</div>
						<div className="Editor-container">
							<div className="Editor-container-element">Defend HP: </div>
							<input
								className="Editor-input"
								type="number"
								value={this.state.defendHp}
								onChange={(event) => this.changeProperty(event, "defendHp")}/>
						</div>
						<div className="Editor-container">
							<div className="Editor-container-element">Landscape: </div>
							<select
								className="Editor-input"
								value={this.state.defendLandscape}
								onChange={(event) => this.changeProperty(event, "defendLandscape")}>
								{this.props.options.dictionaries.landscape.map((item, index) => (
									<option value={index}>{item}</option>
								))}
							</select>
						</div>
						<div className="Editor-container">
							<div className="Editor-container-element">Rank: </div>
							<select
								className="Editor-input"
								value={this.state.defendRank}
								onChange={(event) => this.changeProperty(event, "defendRank")}>
								{this.props.options.dictionaries.rank.map((item, index) => (
									<option value={index}>{item}</option>
								))}
							</select>
						</div>
						<div className="Editor-container">
							<div className="Editor-container-element">Support Ally Count: </div>
							<select
								className="Editor-input"
								value={this.state.defendSupportAllyCount}
								onChange={(event) => this.changeProperty(event, "defendSupportAllyCount")}>
								{[0, 1, 2, 3, 4].map((item, index) => (
									<option value={item}>{item}</option>
								))}
							</select>
						</div>
						<div className="Editor-container">
							<div className="Editor-container-element">Support Enemy Count: </div>
							<select
								className="Editor-input"
								value={this.state.defendSupportEnemyCount}
								onChange={(event) => this.changeProperty(event, "defendSupportEnemyCount")}>
								{[0, 1, 2, 3, 4].map((item, index) => (
									<option value={item}>{item}</option>
								))}
							</select>
						</div>
					</div>
				</div>
				<table className="Damage-table">
					<tr>
						<td/>
						{unitNames.map((unitName) => (
							<td>
								<img src={"resources/units/" + unitName + ".png"} width="30px" height="30px" />
							</td>
						))}
					</tr>
					{unitNames.map((defendUnitName) => {
						return (
							<tr>
								<td>
									<img src={"resources/units/" + defendUnitName + ".png"} width="30px" height="30px" />
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