import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../../Elements/Icon/Icon';
import Sprites from '../../Elements/Sprites/Sprites';

import styles from './Radio.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

import { newId, renderIf } from '@/utils';

const Radio = (props) => {
	const RadioClass = cx({
		radioWrapper: true,
		disabled: props.disabled
	});
	
	const onClick = (event) => {
		return props.onClick ? props.onClick(event.target.checked) : null;
	};
	
	const onChange = (value) => {
		return props.onChange ? props.onChange(event.target.checked) : null;
	};

	const idFor = newId();
	const input = (
		<input
			id={idFor}
			type='radio'
			defaultChecked={props.checked}
			className={styles.radio} 
			name={props.name} 
			onClick={onClick}
			onChange={onChange}
			value={props.value} 
			disabled={props.disabled}
		/>
	);

	const SpritesElement = (
		renderIf(props.sprites)(
			<span className={styles.sprites}>
				<Sprites name={props.sprites} />
			</span>
		)
	);

	const IconElement = (
		renderIf(props.icon)(
			<span className={styles.icon}>
				<Icon name={props.icon} />
			</span>
		)
	);


	return (
		<label className={RadioClass} htmlFor={idFor}>
			{input}
			<span className={styles.radioInput} />
			<span className={styles.radioText}>
				{props.content} &nbsp;
				{SpritesElement}
				{IconElement}
			</span>
		</label>
	);
};

export default Radio;

Radio.propTypes = {
	value: PropTypes.string,
	name: PropTypes.string,
	content: PropTypes.string,
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
	onChange: PropTypes.func,
	checked: PropTypes.bool
};