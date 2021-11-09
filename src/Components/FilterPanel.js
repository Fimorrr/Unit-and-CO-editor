import React, { Component } from 'react';
import EditorElement from './EditorElement';
import '../App.css';

class FilterPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
            filterCategories: [
                [
                    "All",
                    "Attack",
                    "Defence"
                ],
                [
                    "All",
                    "Landscape",
                    "Non-Landscape"
                ],
                [
                    "All",
                    "Heal",
                    "Vampire"
                ],
                [
                    "All",
                    "Int",
                    "Enum",
                    "Bool",
                    "String"
                ]
            ],
            selectedCategories: [
                0,
                0,
                0,
                0
            ]
        };

        this.clickFilter = this.clickFilter.bind(this);
    }

    clickFilter = (categorieNumber, filterNumber) => {
        let newCategories = [...this.state.selectedCategories];

        newCategories[categorieNumber] = filterNumber;

        this.setState(() => ({
            selectedCategories: newCategories
        }));
    }

    render() {
        return (
            <div class="Filter-panel-container">
                <div>Filter panel</div>
                {
                    this.state.filterCategories.map((categorie, categorieNumber) => {
                        let buttons = categorie.map((filter, filterNumber) => {
                            let isSelected = this.state.selectedCategories[categorieNumber] === filterNumber;

                            return <button className={isSelected ? "Button-selected" : ""} onClick={() => this.clickFilter(categorieNumber, filterNumber)}>{filter}</button>;
                        });
                        
                        return <div>{buttons}</div>;
                    })
                }
            </div>
        );
    }
}

export default FilterPanel;