import React, { Component } from 'react';
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
			this.setSprites(this.props.ccType ? this.props.ccType : '');
		}
	}

	onChange(event) {
		if (this.props.creditCard) {
			const trimCC = event.target.value.replace(/_| /g, '');
			if (trimCC.length < 1) {
				this.setSprites();
			} else if (trimCC.length < 3) {
				this.creditCardValidation(trimCC);
			} else if (trimCC.length > 12) {
				this.luhnCCValidation(trimCC);
			}
		}
	}

	setSprites(name) {
		this.setState({
			sprites: name || 'payment-option'
		});
	}

	luhnCCValidation(cc) {
		console.log(cc);
		this.setState({
			ccValid: luhnCC.isValid(cc)
		});
	}


	creditCardValidation(ccNumber) {
		const validCard = creditCardType(ccNumber);
		if (validCard[0]) {
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
			success: (!!this.props.success || this.state.ccValid),
			warning: !!this.props.warning,
			message: !!this.props.message,
			required: !!this.props.required,
			[`Input__${this.props.sprites}`]: !!this.props.sprites
		});
		const idFor = newId();
		
		return (
			<div className={inputWrapper}>
				{ this.props.label ? <label htmlFor={idFor}>{this.props.label}{this.props.required ? ' *' : null}</label> : null } 
				{
					this.props.creditCard ? 
						<MaskedInput className={inputClass} placeholder={this.props.placeholder} mask='1111 1111 1111 1111' name='card' size='20' onChange={this.onChange} />
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