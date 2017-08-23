import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectProps } from '@/decorators';
import styles from './Select.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

import Icon from '../../Elements/Icon/Icon';
import Sprites from '../../Elements/Sprites/Sprites';
import Input from '../../Elements/Input/Input';
import { newId, renderIf } from '@/utils';

export default class Select extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			options: [],
			selectedLabel: this.props.selectedLabel || 'Please Select...',
			showOption: false,
			selected: this.props.selected || {}
		};
		this.getFilter = this.getFilter.bind(this);
		this.setOptions = this.setOptions.bind(this);
		this.hideDropdown = this.hideDropdown.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.selected !== nextProps.selected) {
			this.setState({
				selected: nextProps.selected
			});
		}
		if (this.state.showOption !== nextProps.shown) {
			this.setState({
				showOption: nextProps.shown
			});
		}
		if (this.state.options !== nextProps.options) {
			this.setState({
				options: nextProps.options
			});
		}
	}

// ----------------------------------------
// Getters
// ----------------------------------------

	getFilter(event) {
		const filterValue = event.target.value.toUpperCase();
		console.log(filterValue);
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

	setOptions(event) {
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

	@injectProps
	render({
		error,
		horizontal,
		top,
		label,
		required,
		filter,
		selected,
		message,
		addButton
	}) {
		const idFor = newId();

		const SelectWrapper = cx({
			Select: true,
			error: !!error,
			horizontal: !!horizontal,
			required: !!required,
			shown: this.state.showOption,
			top: !!top,
		});

		const {
			options
		} = this.state;
		return (
			<div className={SelectWrapper}>
				<div 
					role='button' 
					tabIndex={0} 
					onClick={this.hideDropdown} 
					className={styles.overlay}
				/>
				{ 
					renderIf(label)(
						<label htmlFor={idFor}>
							{label}
							{required ? ' *' : ''}
						</label>
					)
				} 
				<div className={styles.selectedContainer}>
					<button 
						type='button'
						id={idFor}
						onClick={this.setOptions} 
						className={styles.previewLabel}
					>	
						<div className={styles.text}>
							{
								this.state.selectedLabel
							} {
								renderIf(this.state.selected.imagePath)(
									<img src={this.state.selected.imagePath} alt='logo' />
								)
							} {
								renderIf(this.state.selected.sprites)(
									<Sprites name={this.state.selected.sprites} />
								)
							}
						</div>
						<Icon name={this.state.showOption ? 'sort-asc' : 'sort-desc'} />
					</button>
					<div className={this.state.showOption ? `${styles.listData} ${styles.shown}` : styles.listData}>
						{
							renderIf(filter)(
								<div className={styles.quickFilter}>
									<Input 
										type='text' 
										name='quickfilter' 
										onChange={this.getFilter} 
										placeholder='Quick Search'
									/>
								</div>
							)
						}
						
						<div className={styles.overflow}>
							{
								renderIf(options.length > 0)(
									options.map((option, i) => (
										<button 
											key={i}
											type='button'
											className={
												option.value !== this.state.selected.value ? null : styles.selected
											} 
											onClick={() => this.setSelectOption(option)} 
											disabled={!!option.disabled}
										>
											<div className={styles.text}>
												{
													option.label
												} {
													renderIf(option.imagePath)(
														<img src={option.imagePath} alt='logo' />
													)
												} {
													renderIf(option.sprites)(
														<Sprites name={option.sprites} />
													)
												}
											</div>
											{
												renderIf(option.info)(
													<div className={styles.info}>{option.info}</div>
												)
											} {
												renderIf(option.message)(
													<div className={styles.optionMessage}>{option.message}</div>
												)
											}
										</button>
									))
								)
							}
						</div>
						{
							renderIf(addButton)(
								addButton
							)
						}
					</div>
				</div>
				{
					renderIf(message)(
						<div className={styles.message}>
							{message}
						</div>
					)
				}
			</div>
		);
	}
};

Select.propTypes = {
	selectedLabel: PropTypes.string,
	options: PropTypes.array,
	name: PropTypes.string,
	onChange: PropTypes.func,
	error: PropTypes.bool,
	horizontal: PropTypes.bool,
	required: PropTypes.bool,
	top: PropTypes.bool,
	selected: PropTypes.object,
	label: PropTypes.string,
	filter: PropTypes.bool,
	message: PropTypes.string
};