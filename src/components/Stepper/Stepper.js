import React, { Component } from 'react';
import styles from './Stepper.scss';
import Icon from '@/components/Icon';

export default class Stepper extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			value: this.props.value ? this.props.value : 1
		};
	}

	onChange() {
		this.props.onChange(this.state.value);
	};

	render() {
		return (
			<div className={styles.Stepper}>
				<button 
					onClick={() => this.setState({ 
						value: this.state.value - 1 
					})} 
					type='button' 
					disabled={this.state.value === 1} 
					className={styles.minus}
				>
					<Icon name='minus' />
				</button>
				<input type='number' onChange={() => this.onChange()} readOnly value={this.state.value} />
				<button 
					onClick={() => this.setState({ 
						value: this.state.value + 1 
					})} 
					type='button' 
					disabled={this.state.value === this.props.maxValue} 
					className={styles.plus}
				>
					<Icon name='plus' />
				</button>
				{ 
					this.state.value === this.props.maxValue ? 
						<div className={styles.stockLeft}>Stok hanya {this.props.maxValue}</div> : null
				}
			</div>
		);
	}
};