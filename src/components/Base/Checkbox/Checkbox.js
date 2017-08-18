import React from 'react';
import PropTypes from 'prop-types';

import styles from './Checkbox.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

import { newId } from '@/utils';

const Checkbox = (props) => {
	const CheckboxClass = cx({
		CheckboxWrapper: true
	});

	const onClick = (event) => {
		if (props.onClick) {
			return props.onClick(event.target.checked);
		}
		return null;
	};

	const idFor = newId();
	const input = (
		<input
			id={idFor}
			type='checkbox'
			defaultChecked={props.checked}
			className={styles.Checkbox} 
			name={props.name} 
			onClick={onClick}
			value={props.value} 
			disabled={props.disabled}
		/>
	);

	return (
		<label className={CheckboxClass} htmlFor={idFor}>
			{input}
			<span className={styles.checkboxInput} />
			<span className={styles.checkboxText}>
				{props.content}
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