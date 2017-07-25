import React, { Component } from 'react';
import styles from './Select.scss';
import Icon from '@/components/Icon';
import Input from '../Input';
import HotKey from 'react-shortcut';

export default class Select extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			options: this.props.options,
			selectedLabel: this.props.selectedLabel ? this.props.selectedLabel : 'Please Select...',
			elevatorState: 0,
			showOption: false,
			selected: {
				value: '',
				label: ''
			}
		};
		this.handleFilter = this.handleFilter.bind(this);
		this.handleToggleOptions = this.handleToggleOptions.bind(this);
	}

	handleFilter(event) {
		const filterValue = event.target.value.toUpperCase();
		const filterData = this.props.options.map((option) => {
			const filterLabel = option.label.toUpperCase();
			return (filterLabel.toUpperCase().indexOf(filterValue) > -1) ? option : null;
		}).filter((option) => {
			return option;
		});
		this.setState({
			options: filterData
		});
	}

	handleToggleOptions() {
		this.setState({
			showOption: !this.state.showOption
		});
	}

	handleSelectOption(selected) {
		this.setState({
			selected,
			selectedLabel: selected.label
		});
		this.handleToggleOptions();
	}

	checkSelected(key) {
		return key === this.state.elevatorState ? styles.highlight : null;
	}

	render() {
		const elevator = (key, events) => {
			switch (key[0]) {
			case 'arrowdown':
				if (this.state.elevatorState > this.state.elevatorState.length) {
					this.setState({
						elevatorState: this.state.elevatorState + 1
					});
				}
				break;

			case 'arrowup':
				if (this.state.elevatorState > 0) {
					this.setState({
						elevatorState: this.state.elevatorState - 1
					});
				}
				break;
				
			default:
				break;
			}
		};
		return (
			<div className={styles.Select}>
				<button 
					type='button' 
					onClick={this.handleToggleOptions} 
					className={styles.previewLabel}
				>
					{this.state.selectedLabel}
					<Icon name={this.state.showOption ? 'sort-asc' : 'sort-desc'} />
				</button>
				{
					this.state.showOption ? (
						<div className={styles.listData}>
							<div className={styles.quickFilter}>
								<Input 
									type='text' 
									name='quickfilter' 
									onChange={this.handleFilter} 
									placeholder='quick filter' 
								/>
							</div>
							<div className={styles.overflow}>
								<HotKey
									keys={['arrowdown']}
									simultaneous
									onKeysCoincide={elevator}
								/>
								<HotKey
									keys={['arrowup']}
									simultaneous
									onKeysCoincide={elevator}
								/>
								{
									this.state.options.map((option, i) => (
										<button 
											className={option.value === this.state.selected.value ? styles.selected : null} 
											onClick={() => this.handleSelectOption(option)} 
											type='button'
											key={i}
										>
											{option.label}
										</button>
									))
								}
							</div>
						</div>
					) : null
				}
			</div>
		);
	}
};