import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { injectProps } from '@/decorators';
import { newId, renderIf } from '@/utils';
import Icon from '../Icon/Icon';
import Sprites from '../Sprites/Sprites';

import styles from './Input.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


export default class Input extends Component {
	constructor(props) {	
		super(props);
		this.props = props;
		this.state = {
			sprites: null
		};
	}

	@injectProps
	render({
		size,
		label,
		type,
		name,
		placeholder,
		value,
		onClick,
		readOnly,
		horizontal,
		sprites,
		onKeyPress,
		onChange,
		icon,
		disabled,
		onBlur,
		onFocus,
		message,
		className,
		variant,
		color
	}) {
		const inputWrapper = cx({
			inputWrapper: true,
			horizontal: !!horizontal,
			[`${variant}`]: !!variant,
		});

		const inputBodyClass = cx({
			inputBody: true,
			horizontal: !!horizontal,
		});

		const inputClass = cx({
			input: true,
			[`${className}`]: !!className,
			[`${size}`]: !!size,
			[`${color}`]: !!color
		});

		const idFor = newId();

		const LabelElement = (
			renderIf(label)(
				<label htmlFor={idFor}>
					{label}
				</label> 
			)
		);

		const SpritesElement = (
			renderIf(sprites)(
				<span className={styles.sprites}>
					<Sprites name={sprites} />
				</span>
			)
		);

		const IconElement = (
			renderIf(icon)(
				<span className={styles.icon}>
					<Icon name={icon} />
				</span>
			)
		);

		const MessageElement = (
			renderIf(message)(
				<div className={styles.message}>{message}</div>
			)
		);

		const InputElement = (
			<input
				id={idFor}
				disabled={!!disabled}
				className={inputClass} 
				type={type}
				name={name}
				readOnly={readOnly}
				placeholder={placeholder}
				defaultValue={value}
				onClick={onClick}
				onKeyPress={onKeyPress}
				onBlur={onBlur}
				onFocus={onFocus}
				minLength={this.props.minLength} 
				maxLength={this.props.maxLength}
				onChange={onChange}
			/>
		);

		return (
			<div className={inputWrapper}>
				{LabelElement}
				{variant === 'ovo' && <Sprites className={styles.ovoIcon} name='ovo' />}
				<div className={inputBodyClass}>
					{InputElement}
					{MessageElement}
					{SpritesElement}
					{IconElement}
				</div>
			</div>
		);
	}
};


Input.propTypes = {
	/** make horinzontal layout. */
	horizontal: PropTypes.bool,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	color: PropTypes.oneOf(['red', 'yellow', 'orange', 'green', 'black', 'purple']),
	/** label content. */
	label: PropTypes.string,
	/** Input Attribute Type. */
	type: PropTypes.oneOf(['text', 'password', 'date', 'email', 'hidden', 'password', 'number', 'search']),
	/** Input Attribute Name. */
	name: PropTypes.string,
	/** Input Attribute Placeholder. */
	placeholder: PropTypes.string,
	/** Input Attribute value. */
	value: PropTypes.string,
	/** Input Attribute Read Only. */
	readOnly: PropTypes.bool,
	/** Add image Sprites. */
	sprites: PropTypes.string,
	/** Add Icon. */
	icon: PropTypes.string,
	/** Textarea info or message. */
	message: PropTypes.string
};