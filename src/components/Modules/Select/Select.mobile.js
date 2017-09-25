import React, { Component } from 'react';
import styles from './Select.mobile.scss';
// import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import Input from '../../Elements/Input';
import { renderIf, newId } from '@/utils';

class SelectMobile extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.idFor = newId();
		this.setFilterOption = this.setFilterOption.bind(this);
		this.state = {
			showModalSelect: false
		};
	}

	componentWillMount() {
		this.setState({
			selected: this.props.selected || this.props.options[0],
			options: this.props.options || [],
		});
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.options !== nextProps.options) {
			this.setState({
				options: nextProps.options,
				selected: nextProps.options[0]
			});
		}

		if (this.props.selected !== nextProps.selected) {
			this.setState({
				selected: nextProps.selected
			});
		}

		if (this.props.show !== nextProps.show) {
			this.setState({
				showModalSelect: nextProps.show
			});
		}
	}

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

	setFilterOption(filterData) {
		this.setState({
			options: filterData,
			emptyFilter: filterData.length < 1 || false,
		});
	}

	toggleModalAddress() {
		if (this.props.onClick) this.props.onClick(!this.state.showModalSelect); 
		this.setState({ 
			options: this.props.options,
			showModalSelect: !this.state.showModalSelect 
		});
	}

	selectOption(selected) {
		this.setState({ selected });
		if (this.props.onChange) {
			const withName = {
				name: this.props.name,
				label: selected.label,
				value: selected.value
			};
			this.props.onChange(withName);
		}
		this.toggleModalAddress();
	}

	render() {
		const { label, filter, addButton } = this.props;
		
		const LabelElement = (
			renderIf(label)(
				<label htmlFor={this.idFor}>
					{label}
				</label>
			)
		);

		if (!this.state.selected) {
			return null;
		}
		
		return (
			<div className={styles.selectWrapper}>
				{LabelElement}
				<button 
					className={styles.select}
					onClick={() => this.toggleModalAddress()} 
				>
					<span>{this.state.selected.label}</span>
				</button>
				<Modal 
					close
					className={styles.modal} 
					show={this.state.showModalSelect} 
					handleClose={() => this.toggleModalAddress()}
				>
					<Modal.Header className={styles.headerFilter}>
						{
							!filter ? label : (
								<Input onChange={(event) => this.getFilter(event)} placeholder='Cari Kecamatan' icon='search' iconPosition='left' />
							)
						}
					</Modal.Header>
					<Modal.Body className={styles.bodyFilter}>
						{
							this.state.options.map((option, i) => (
								<button 
									key={i}
									type='button'
									onClick={() => this.selectOption(option)}
									className={this.state.selected.value === option.value ? styles.selectedOption : ''}
								>
									<span className={styles.text}>
										{ option.label} 
									</span>
								</button>
							))
						}
					</Modal.Body>
					{
						addButton && (
							<Modal.Footer>
								{addButton}
							</Modal.Footer>
						)
					}
				</Modal>
			</div>
		);
	}
}

export default SelectMobile;