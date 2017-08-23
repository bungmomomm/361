import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Stepper.scss';
import Icon from '../../Elements/Icon/Icon';
import { renderIf } from '@/utils';

export default class Stepper extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			value: this.props.value || 1,
			error: false,
		};
		this.increment = this.increment.bind(this);
		this.decrement = this.decrement.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	onChange(event) {
		let value = event.target.value;
		value = value >= this.props.maxValue ? this.props.maxValue : value;
		const stepperValue = {
			value,
			error: (event.target.value >= this.props.maxValue)
		};
		this.setState(stepperValue);
		if (this.props.onChange) {
			this.props.onChange(this.state);
		}
	};

	checkMax() {
		this.setState({
			error: this.state.value === this.props.maxValue
		});
	}

	increment() {
		this.setState({ 
			value: this.state.value + 1 
		});
	}

	decrement() {
		this.setState({ 
			value: this.state.value - 1 
		});
	}

	render() {
		return (
			<div className={styles.Stepper}>
				<button 
					onClick={this.decrement}
					type='button' 
					disabled={this.state.value === 1} 
					className={styles.minus}
				>
					<Icon name='minus' />
				</button>
				<input type='number' onChange={this.onChange} value={this.state.value} />
				<button 
					onClick={this.increment}
					type='button' 
					disabled={this.state.value === this.props.maxValue} 
					className={styles.plus}
				>
					<Icon name='plus' />
				</button>
				{ 
					renderIf(this.state.value === this.props.maxValue || this.state.error)(
						<div className={styles.stockLeft}>Stok hanya {this.props.maxValue}</div>
					)
				}
			</div>
		);
	}
};

Stepper.propTypes = {
	value: PropTypes.number,
	onChange: PropTypes.func,
	maxValue: PropTypes.number
};