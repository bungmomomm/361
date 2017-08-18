import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectProps } from '@/decorators';

import styles from './CreditCardInput.scss';
import classNames from 'classnames/bind';
import { newId, renderIf } from '@/utils';
const cx = classNames.bind(styles);

import Sprites from '@/components/Sprites';
import creditCardType from 'credit-card-type';
import MaskedInput from 'react-maskedinput';
import luhnCC from 'luhn-cc';

export default class CreditCardInput extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			sprites: 'payment-option'
		};
		this.onChange = this.onChange.bind(this);
	}
	
	componentWillMount() {
		if (this.props.value) {
			const trimCC = this.props.value.replace(/_| /g, '');
			this.creditCardValidation(trimCC);
			this.luhnCCValidation(trimCC);
		}
	}

	onChange(event) {
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
		this.props.onChange({
			ccNumber: cc,
			valid: luhnCC.isValid(cc),
		});
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
		type,
		name,
		placeholder,
		value,
		onClick,
		readOnly,
		onKeyPress,
		sprites,
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
			[`CreditCardInput__${this.state.ccValid}`]: !!this.state.ccValid,
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
			<span className={styles.sprites}>
				<Sprites name={this.state.sprites} />
			</span>
		);

		const MessageElement = (
			renderIf(message)(
				<div className={styles.message}>{message}</div>
			)
		);
		
		return (
			<div className={inputWrapper}>
				{LabelElement} 
				{
					<MaskedInput
						className={inputClass} 
						placeholder={placeholder} 
						mask='1111 1111 1111 1111' 
						name='card' 
						size={20}
						value={value}
						onChange={this.onChange}
					/>
				} 
				{SpritesElement}
				{MessageElement}
			</div>
		);
	}
};

CreditCardInput.propTypes = {
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