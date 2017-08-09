import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectProps } from '@/decorators';

import styles from './Input.scss';
import classNames from 'classnames/bind';
import newId from '@/utils/newId.js';
const cx = classNames.bind(styles);

import Icon from '@/components/Icon';
import Sprites from '@/components/Sprites';
import creditCardType from 'credit-card-type';
import MaskedInput from 'react-maskedinput';
import luhnCC from 'luhn-cc';

export default class Input extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			sprites: null
		};
		this.onChange = this.onChange.bind(this);
	}

	componentWillMount() {
		if (this.props.creditCard) {
			this.setSprites(this.props.ccType || '');
		}
	}

	onChange(event) {
		if (this.props.creditCard) {
			const trimCC = event.target.value.replace(/_| /g, '');
			const trimCCLength = trimCC.length;
			this.setValidInput(null);
			if (trimCCLength < 1) {
				this.setSprites();
			} else if (trimCCLength < 3) {
				this.creditCardValidation(trimCC);
			} else if (trimCCLength > 12) {
				this.luhnCCValidation(trimCC);
			}
		}
		return this.props.onChange ? this.props.onChange(event) : null;
	}

	setSprites(name) {
		this.setState({
			sprites: name || 'payment-option'
		});
	}

	setValidInput(value) {
		this.setState({
			ccValid: value
		});
	}

	luhnCCValidation(cc) {
		return luhnCC.isValid(cc) ? this.setValidInput('green') : this.setValidInput('red');
	}

	creditCardValidation(ccNumber) {
		const validCard = creditCardType(ccNumber);
		if (validCard[0]) {
			const type = validCard[0].type;
			if (type === 'jcb' || type === 'visa' || type === 'master-card') {
				this.setSprites(type);
			}
		}
	}

	@injectProps
	render({
		horizontal,
		error,
		size,
		label,
		creditCard,
		type,
		name,
		placeholder,
		value,
		onClick,
		readOnly,
		onKeyPress,
		sprites,
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
			[`Input__${this.state.ccValid}`]: !!this.state.ccValid,
			[`${sprites}`]: !!sprites
		});
		
		const idFor = newId();
		
		return (
			<div className={inputWrapper}>
				{ 
					!label ? null : (
						<label htmlFor={idFor}>
							{label}
						</label> 
					)
				} 
				{
					creditCard ? 
						<MaskedInput
							className={inputClass} 
							placeholder={placeholder} 
							mask='1111 1111 1111 1111' 
							name='card' 
							size={20} 
							onChange={this.onChange} 
						/>
						: 
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
							onChange={this.onChange}
						/>
				} 
				{
					!sprites || !this.state.sprites ? null : (
						<span className={styles.sprites}>
							<Sprites name={this.state.sprites || sprites} />
						</span>
					)
				} 
				{
					!icon ? null : (
						<span className={styles.icon}>
							<Icon name={icon} />
						</span>
					)
				} 
				{
					!message ? null : (
						<div className={styles.message}>{message}</div>
					)
				}
			</div>
		);
	}
};

Input.propTypes = {
	ccType: PropTypes.string,
	onChange: PropTypes.func,
	horizontal: PropTypes.bool,
	error: PropTypes.bool,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	color: PropTypes.oneOf(['green', 'red', 'yellow']),
	label: PropTypes.string,
	creditCard: PropTypes.bool,
	type: PropTypes.oneOf(['text', 'password', 'date', 'email', 'hidden', 'password', 'number', 'search']),
	name: PropTypes.string,
	placeholder: PropTypes.string,
	onClick: PropTypes.func,
	onKeyPress: PropTypes.func,
	sprites: PropTypes.string,
	icon: PropTypes.string,
	message: PropTypes.string
};