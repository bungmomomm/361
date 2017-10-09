import React, { Component } from 'react';
import PropTypes from 'prop-types';
import creditCardType from 'credit-card-type';

import Sprites from '@/components/Elements/Sprites';
import { newId, renderIf } from '@/utils';

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

	render() {
		const CreditCardRadioClass = cx({
			CreditCardRadioWrapper: true,
			[`size--${this.props.size}`]: !!this.props.size
		});

		const {
			sprites,
			content,
			image,
			...rest
		} = this.props;

		const idFor = newId();
		const input = (
			<input
				id={idFor}
				type='radio'
				className={styles.creditCardRadio} 
				{...rest}
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
				{
					renderIf(image)(
						<span className={styles.sprites}>
							<img src={image} alt='credit cart' />
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