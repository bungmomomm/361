import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../Elements/Icon/Icon';
import Sprites from '../../Elements/Sprites/Sprites';

import styles from './Checkbox.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

import { newId, renderIf } from '@/utils';

const Checkbox = (props) => {

	const CheckboxClass = cx({
		CheckboxWrapper: true,
		disabled: props.disabled
	});
	
	const { icon, sprites, onClick, ...rest } = props;

	const thisClick = (event) => {
		if (onClick) {
			return onClick(event.target.checked, event.target.value);
		}
		return null;
	};

	const idFor = newId();
	const input = (
		<input
			id={idFor}
			type='checkbox'
			className={styles.Checkbox} 
			onClick={thisClick}
			{...rest}
		/>
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
	

	return (
		<label className={CheckboxClass} htmlFor={idFor}>
			{input}
			<span className={styles.checkboxInput} />
			<span className={styles.checkboxText}>
				{props.content}
				{SpritesElement}
				{IconElement}
			</span>
		</label>
	);
};

export default Checkbox;

Checkbox.propTypes = {
	value: PropTypes.string,
	name: PropTypes.string,
	content: PropTypes.string,
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
	onChange: PropTypes.func,
	checked: PropTypes.bool
};