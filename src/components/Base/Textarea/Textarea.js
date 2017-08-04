import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectProps } from '@/decorators';
import styles from './Textarea.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import newId from '@/utils/newId.js';

export default class Textarea extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	@injectProps
	render({
		horizontal,
		error,
		size,
		success,
		warning,
		required,
		label,
		type,
		name,
		placeholder,
		value,
		onClick,
		onChange,
		message
	}) {
		const TextareaWrapper = cx({
			TextareaWrapper: true,
			horizontal: !!horizontal
		});

		const TextareaClass = cx({
			Textarea: true,
			error: !!error,
			[`${size}`]: !!size,
			success: !!success,
			warning: !!warning,
			required: !!required
		});

		const idFor = newId();
		return (
			<div className={TextareaWrapper}>
				{ 
					!label ? null : (
						<label htmlFor={idFor}>
							{label}
							{required ? ' *' : null}
						</label>
					)
				} 
				<textarea 
					id={idFor}
					className={TextareaClass} 
					type={type} 
					name={name}
					placeholder={placeholder}
					defaultValue={value}
					onClick={onClick}
					onChange={onChange}
				/>
				{
					!message ? null : (
						<div className={styles.message}>
							{message}
						</div>
					)
				}
			</div>
		);
	}
};

Textarea.propTypes = {
	horizontal: PropTypes.bool,
	error: PropTypes.bool,
	size: PropTypes.string,
	success: PropTypes.bool,
	warning: PropTypes.bool,
	label: PropTypes.string,
	required: PropTypes.bool,
	type: PropTypes.string,
	name: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.string,
	onClick: PropTypes.func,
	onChange: PropTypes.func,
	message: PropTypes.string
};