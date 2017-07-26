import React, { Component } from 'react';
import styles from './Input.scss';
import classNames from 'classnames/bind';
import newId from '@/utils/newId.js';
const cx = classNames.bind(styles);

export default class Input extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const inputWrapper = cx({
			inputWrapper: true,
			horizontal: !!this.props.horizontal
		});

		const inputClass = cx({
			input: true,
			error: !!this.props.error,
			[`${this.props.size}`]: !!this.props.size,
			success: !!this.props.success,
			warning: !!this.props.warning,
			msg: !!this.props.msg,
			required: !!this.props.required
		});
		const idFor = newId();
		return (
			<div className={inputWrapper}>
				{ this.props.label ? <label htmlFor={idFor}>{this.props.label}{this.props.required ? ' *' : null}</label> : null } 
				<input 
					id={idFor}
					className={inputClass} 
					type={this.props.type} 
					name={this.props.name}
					placeholder={this.props.placeholder}
					defaultValue={this.props.value}
					onClick={this.props.onClick}
					onChange={this.props.onChange}
				/>
				{
					this.props.msg ? <div className={styles.msg}>{this.props.msg}</div> : null
				}
			</div>
		);
	}
};