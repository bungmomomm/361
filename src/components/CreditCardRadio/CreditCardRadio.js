import React, { Component } from 'react';
import PropTypes from 'prop-types';
import creditCardType from 'credit-card-type';

import Sprites from '@/components/Sprites';
import { newId, renderIf } from '@/utils';
import { injectProps } from '@/decorators';

import classNames from 'classnames/bind';
import styles from './CreditCardRadio.scss';
const cx = classNames.bind(styles);


class CreditCardRadio extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			sprites: ''
		};
	}

	componentWillMount() {
		// const cc = this.props.content;
		// const ccNumber = () => {
		// 	return (!cc || !cc.length) ? cc.slice(0, 2) : null;
		// };
		// this.creditCardValidation(ccNumber);
	}

	creditCardValidation(ccNumber) {
		const validCard = creditCardType(ccNumber);
		if (validCard[0]) {
			const type = validCard[0].type;
			if (type === 'jcb' || type === 'visa' || type === 'master-card') {
				this.setState({
					sprites: type
				});
			}
		}
	}

	@injectProps	
	render({
		checked,
		name,
		onClick,
		value,
		disabled,
		sprites,
		content
	}) {
		const CreditCardRadioClass = cx({
			CreditCardRadioWrapper: true
		});
		const idFor = newId();
		const input = (
			<input
				id={idFor}
				type='radio'
				checked={checked}
				className={styles.creditCardRadio} 
				name={name} 
				onClick={() => onClick(value)}
				value={value} 
				disabled={disabled}
			/>
		);

		return (
			<label className={CreditCardRadioClass} htmlFor={idFor}>
				{input}
				<span className={styles.creditCardRadioInput} />
				<span className={styles.creditCardRadioText}>
					{content}
				</span>
				<div className={styles.blockList} />
				{
					renderIf(sprites)(
						<span className={styles.sprites}>
							<Sprites name={sprites} />
						</span>
					)
				} 
			</label>
		);
	}
};

export default CreditCardRadio;

CreditCardRadio.propTypes = {
	/** Attribute value. */
	value: PropTypes.string,
	/** Attribute Name. */
	name: PropTypes.string,
	/** Content. */
	content: PropTypes.string,
	/** Disabled Radio. */
	disabled: PropTypes.bool,
	/** Default checked Radio. */
	checked: PropTypes.bool
};