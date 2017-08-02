import React, { Component } from 'react';
import styles from './Select.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

import Icon from '@/components/Icon';
import Sprites from '@/components/Sprites';
import Input from '../Input';
import newId from '@/utils/newId.js';


export default class Select extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			options: this.props.options,
			selectedLabel: this.props.selectedLabel ? this.props.selectedLabel : 'Please Select...',
			showOption: false,
			selected: {
				value: '',
				label: ''
			}
		};
		this.getFilter = this.getFilter.bind(this);
		this.setOptions = this.setOptions.bind(this);
		this.hideDropdown = this.hideDropdown.bind(this);
	}

// ----------------------------------------
// Getters
// ----------------------------------------

	getFilter(event) {
		const filterValue = event.target.value.toUpperCase();
		const filterData = this.props.options.map((option) => {
			const filterLabel = option.label.toUpperCase();
			return (filterLabel.toUpperCase().indexOf(filterValue) > -1) ? option : null;
		}).filter((option) => {
			return option;
		});
		this.setFilterOption(filterData);
	}

	getSelected(key) {
		return key === this.state.elevatorState ? styles.highlight : null;
	}

// ----------------------------------------
// Setters
// ----------------------------------------

	setFilterOption(filterData) {
		this.setState({
			options: filterData
		});
	}

	setOptions() {
		this.setState({
			options: this.props.options,
			showOption: !this.state.showOption
		});
	}

	setSelectOption(selected) {
		this.setOptions();
		this.setState({
			selected,
			selectedLabel: selected.label
		});
		if (this.props.onChange) {
			const withName = {
				name: this.props.name,
				label: selected.label,
				value: selected.value
			};
			this.props.onChange(withName);
		}
	}

// ----------------------------------------
// Component Event Handlers
// ----------------------------------------

	hideDropdown() {
		this.setState({
			showOption: false
		});
	}

	render() {
		const idFor = newId();

		const SelectWrapper = cx({
			Select: true,
			error: !!this.props.error,
			horizontal: !!this.props.horizontal,
			required: !!this.props.required,
			shown: this.state.showOption,
			top: !!this.props.top,
		});

		return (
			<div className={SelectWrapper}>
				<div className={styles.overlay} role='button' tabIndex={0} onClick={this.hideDropdown} />
				{ this.props.label ? <label htmlFor={idFor}>{this.props.label}{this.props.required ? ' *' : null}</label> : null } 
				<div className={styles.selectedContainer}>
					<button 
						type='button'
						id={idFor}
						onClick={this.setOptions} 
						className={styles.previewLabel}
					>	
						<div className={styles.text}>
							{this.state.selectedLabel}
							{
								this.state.selected.imagePath ? <img src={this.state.selected.imagePath} alt='logo' /> : null
							}
							{
								this.state.selected.sprites ? <Sprites name={this.state.selected.sprites} /> : null
							}
						</div>
						<Icon name={this.state.showOption ? 'sort-asc' : 'sort-desc'} />
					</button>
					<div className={this.state.showOption ? `${styles.listData} ${styles.shown}` : styles.listData}>
						{
							this.props.filter ? <div className={styles.quickFilter}>
								<Input 
									type='text' 
									name='quickfilter' 
									onChange={this.getFilter} 
									placeholder='Quick Search' 
								/>
							</div> : null
						}
						
						<div className={styles.overflow}>
							{
								this.state.options.map((option, i) => (
									<button 
										key={i}
										className={option.value === this.state.selected.value ? styles.selected : null} 
										onClick={() => this.setSelectOption(option)} 
										disabled={!!option.disabled}
										type='button'
									>
										<div className={styles.text}>
											{option.label}
											{
												option.imagePath ? <img src={option.imagePath} alt='logo' /> : null
											}
											{
												option.sprites ? <Sprites name={option.sprites} /> : null
											}
										</div>
										{
											option.info ? <div className={styles.info}>{option.info}</div> : null
										}
										{
											option.message ? <div className={styles.optionMessage}>{option.message}</div> : null
										}
									</button>
								))
							}
						</div>
					</div>
				</div>
				{
					this.props.message ? <div className={styles.message}>{this.props.message}</div> : null
				}
			</div>
		);
	}
};