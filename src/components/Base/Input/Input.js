import React, { Component } from 'react';
import styles from './Input.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Input extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		console.log(this.props);
	}

	render() {
		const inputClass = cx({
			input: true
		});
		return (
			<div className={styles.inputWrapper}>
				<input 
					className={inputClass} 
					type={this.props.type} 
					name={this.props.name}
					placeholder={this.props.placeholder}
					{...this.props}
				/>
			</div>
		);
	}
};