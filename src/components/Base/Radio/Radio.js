import React, { Component } from 'react';
import PropTypes from 'prop-types';
import creditCardType from 'credit-card-type';

import Sprites from '@/components/Sprites';
import { injectProps } from '@/decorators';
import newId from '@/utils/newId.js';

import styles from './Radio.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Radio extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.onChange = this.onChange.bind(this);
		this.state = {
			checked: this.props.checked || false
		};
	}

	componentWillMount() {
		if (this.props.creditCard) {
			const cc = this.props.content;
			const ccNumber = cc.slice(0, 2);
			this.creditCardValidation(ccNumber);
		}
	}

// ----------------------------------------
// Getters
// ----------------------------------------

// ----------------------------------------
// Setters
// ----------------------------------------

// ----------------------------------------
// Event Handlers
// ----------------------------------------
	onChange(event) {
		const ContentState = !this.state.checked;
		this.setState({
			checked: ContentState
		});
		return this.props.onChange ? this.props.onChange(ContentState) : null;
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
// ----------------------------------------
// Render
// ----------------------------------------

	@injectProps
	render({
		value,
		name,
		content,
		variant,
		creditCard
	}) {
		const idFor = newId();
		const { 
			checked 
		} = this.state;

		const radioWrapper = cx({
			radioWrapper: true,
			[`${variant}`]: !!variant
		});
		return (
			<label className={radioWrapper} htmlFor={idFor}>
				<input 
					id={idFor} 
					type='radio' 
					checked={checked} 
					onChange={this.onChange} 
					defaultValue={value} 
					className={styles.radio} 
					name={name} 
				/>
				<span className={styles.radioInput} />
				<span className={styles.radioText}>
					{content}
				</span>
				{ variant === 'list' ? <div className={styles.blockList} /> : null }
				{
					!this.state.sprites ? null : (
						<span className={styles.sprites}>
							<Sprites name={this.state.sprites} />
						</span>
					)
				} 
			</label>
		);
	}
};

Radio.propTypes = {
	test: PropTypes.bool
};