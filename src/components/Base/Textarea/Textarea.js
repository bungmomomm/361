import React, { Component } from 'react';
import styles from './Textarea.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import newId from '@/utils/newId.js';

export default class Textarea extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const TextareaWrapper = cx({
			TextareaWrapper: true,
			horizontal: !!this.props.horizontal
		});

		const TextareaClass = cx({
			Textarea: true,
			error: !!this.props.error,
			[`${this.props.size}`]: !!this.props.size,
			success: !!this.props.success,
			warning: !!this.props.warning,
			required: !!this.props.required
		});

		const idFor = newId();
		return (
			<div className={TextareaWrapper}>
				{ this.props.label ? <label htmlFor={idFor}>{this.props.label}{this.props.required ? ' *' : null}</label> : null } 
				<textarea 
					id={idFor}
					className={TextareaClass} 
					type={this.props.type} 
					name={this.props.name}
					placeholder={this.props.placeholder}
					defaultValue={this.props.value}
					onClick={this.props.onClick}
					onChange={this.props.onChange}
				/>
				{
					this.props.message ? <div className={styles.message}>{this.props.message}</div> : null
				}
			</div>
		);
	}
};