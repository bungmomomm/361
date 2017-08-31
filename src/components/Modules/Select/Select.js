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
			selected: this.props.selected || {},
			emptyFilter: false,
		};
		this.getFilter = this.getFilter.bind(this);
		this.setOptions = this.setOptions.bind(this);
		this.hideDropdown = this.hideDropdown.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.selected !== nextProps.selected) {
			this.setState({
				selected: nextProps.selected,
				selectedLabel: nextProps.selectedLabel
			});
		}
		if (this.state.showOption !== nextProps.shown) {
			this.setState({
				showOption: nextProps.shown
			});
		}
		if (this.state.options !== nextProps.options) {
			this.setState({
				options: nextProps.options,
				emptyFilter: false,
			});
		}
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
			options: filterData,
			emptyFilter: filterData.length < 1 || false,
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
		color,
		horizontal,
		top,
		label,
		filter,
		selected,
		message,
		addButton
	}) {
		const idFor = newId();

		const SelectWrapper = cx({
			Select: true,
			horizontal: !!horizontal,
			shown: this.state.showOption,
			[`${color}`]: !!color,
			top: !!top,
		});

		const OptionsClass = cx({
			listData: true,
			shown: this.state.showOption
		});

		const {
			options
		} = this.state;

		const LabelElement = (
			renderIf(label)(
				<label htmlFor={idFor}>
					{label}
				</label>
			)
		);

		const ImageElement = (
			renderIf(this.state.selected.imagePath)(
				<img src={this.state.selected.imagePath} alt='logo' />
			)	
		);
		
		const SpritesElement = (
			renderIf(this.state.selected.sprites)(
				<Sprites name={this.state.selected.sprites} />
			)
		);

		const FilterElement = (
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
		);

		const AddButton = (
			renderIf(addButton)(
				addButton
			)
		);

		const MessageRender = (
			renderIf(message)(
				<div className={styles.message}>
					{message}
				</div>
			)
		);

		return (
			<div className={SelectWrapper}>
				<div 
					role='button' 
					tabIndex={0} 
					onClick={this.hideDropdown} 
					className={styles.overlay}
				/>
				{LabelElement} 
				<div className={styles.selectedContainer}>
					<button 
						type='button'
						id={idFor}
						onClick={this.setOptions} 
						className={styles.previewLabel}
					>	
						<span className={styles.flex}>
							<span className={styles.text}>
								{this.state.selectedLabel} 
								{ImageElement} 
								{SpritesElement}
							</span>
							<Icon name={this.state.showOption ? 'sort-asc' : 'sort-desc'} />
						</span>
					</button>
					<div className={OptionsClass}>
						{FilterElement}
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
											<span className={styles.flex}>
												<span className={styles.text}>
													{ option.label} 
													{
														renderIf(option.imagePath)(
															<img src={option.imagePath} alt='logo' />
														)
													}{
														option.settings ? <img src={option.settings.image} alt='' /> : null
													}{
														renderIf(option.sprites)(
															<Sprites name={option.sprites} />
														)
													}
												</span>
												{
													option.settings ? (
														<div className={styles.info}>{option.settings.info.toString()}</div>
													) : renderIf(option.info)(
														<div className={styles.info}>{option.info}</div>
													)
												}
												{
													renderIf(option.message)(
														<div className={styles.optionMessage}>{option.message}</div>
													)
												}
											</span>
										</button>
									))
								)
							}
						</div>
						{AddButton}
					</div>
					{MessageRender}
				</div>
			</div>
		);
	}
};

Select.propTypes = {
	/** Default select text. */
	selectedLabel: PropTypes.string,
	/** List Data. */
	options: PropTypes.array,
	/** Attribute name. */
	name: PropTypes.string,
	color: PropTypes.oneOf(['red', 'yellow', 'orange', 'green']),
	/** make horinzontal layout. */
	horizontal: PropTypes.bool,
	/** List data Position. */
	top: PropTypes.bool,
	/** selected Value. */
	selected: PropTypes.object,
	/** Label. */
	label: PropTypes.string,
	/** Enable Filter module. */
	filter: PropTypes.bool,
	/** Add custom component or custom action button. */
	addButton: PropTypes.node,
	/** info or message. */
	message: PropTypes.string
};