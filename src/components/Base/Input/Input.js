import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectProps } from '@/decorators';
import { newId, renderIf } from '@/utils';
import styles from './Input.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

import Icon from '@/components/Icon';
import Sprites from '@/components/Sprites';

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
		error,
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
		message,
		color
	}) {
		const inputWrapper = cx({
			inputWrapper: true,
			horizontal: !!horizontal
		});

		const inputClass = cx({
			input: true,
			error: !!error,
			[`${size}`]: !!size,
			[`${color}`]: !!color,
			[`${sprites}`]: !!sprites
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

		return (
			<div className={inputWrapper}>
				{LabelElement}
				<input 
					id={idFor}
					className={inputClass} 
					type={type}
					name={name}
					readOnly={readOnly}
					placeholder={placeholder}
					defaultValue={value}
					onClick={onClick}
					onKeyPress={onKeyPress}
					onChange={onChange}
				/>
				{SpritesElement}
				{IconElement}
				{MessageElement}
			</div>
		);
	}
};


Input.propTypes = {
	error: PropTypes.bool,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	label: PropTypes.string,
	type: PropTypes.string,
	name: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.string,
	onClick: PropTypes.func,
	readOnly: PropTypes.bool,
	horizontal: PropTypes.bool,
	sprites: PropTypes.string,
	onKeyPress: PropTypes.func,
	icon: PropTypes.string,
	message: PropTypes.string,
	color: PropTypes.oneOf(['red', 'yellow', 'orange', 'green'])
};