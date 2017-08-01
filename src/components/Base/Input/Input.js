import React, { Component } from 'react';
import styles from './Input.scss';
import classNames from 'classnames/bind';
import newId from '@/utils/newId.js';
const cx = classNames.bind(styles);

import Icon from '@/components/Icon';
import Sprites from '@/components/Sprites';
import creditCardType from 'credit-card-type';
import MaskedInput from 'react-text-mask';
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
			this.setSprites(this.props.ccType ? this.props.ccType : '');
		}
	}

	onChange(event) {
		if (this.props.creditCard) {
			if (event.target.value.length > 0 && event.target.value.length < 3) {
				this.creditCardValidation(event.target.value.replace(/\s/g, ''));
			}
			if (event.target.value.length < 1) {
				this.setSprites();
			}
		}
	}

	setSprites(name) {
		this.setState({
			sprites: name || 'payment-option'
		});
	}

	luhnCCValidation(cc) {
		this.setState({
			ccValid: luhnCC.isValid(cc)
		});
	}


	creditCardValidation(ccNumber) {
		const validCard = creditCardType(ccNumber);
		if (validCard[0]) {
			this.luhnCCValidation(ccNumber);
			if (validCard[0].type === 'jcb' || validCard[0].type === 'visa' || validCard[0].type === 'master-card') {
				this.setSprites(validCard[0].type);
			}
		}
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
			message: !!this.props.message,
			required: !!this.props.required,
			creditCard: !!this.props.creditCard,
			[`Input__${this.props.sprites}`]: !!this.props.sprites
		});
		const idFor = newId();
		
		return (
			<div className={inputWrapper}>
				{ this.props.label ? <label htmlFor={idFor}>{this.props.label}{this.props.required ? ' *' : null}</label> : null } 
				{
					this.props.creditCard ? 
						<MaskedInput
							mask={[/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /[0-9-*]/, /[0-9-*]/, ' ', /\d/, /\d/, /\d/, /\d/]}
							className={inputClass}
							placeholder={this.props.placeholder}
							guide={false}
							id={idFor}
							type={this.props.type}
							onChange={this.onChange}
						/> 
						: 
						<input 
							id={idFor}
							className={inputClass} 
							type={this.props.type}
							name={this.props.name}
							placeholder={this.props.placeholder}
							defaultValue={this.props.value}
							onClick={this.props.onClick}
							onChange={this.onChange}
						/>
					}
				
				{
					(this.props.sprites || this.state.sprites) ? <span className={styles.sprites}><Sprites name={this.state.sprites ? this.state.sprites : this.props.sprites} /></span> : null
				}
				{
					this.props.icon ? <span className={styles.icon}><Icon name={this.props.icon} /></span> : null
				}
				{
					this.props.message ? <div className={styles.message}>{this.props.message}</div> : null
				}
			</div>
		);
	}
};