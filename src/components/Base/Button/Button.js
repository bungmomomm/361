import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectProps } from '@/decorators';
import styles from './Button.scss';
import Icon from '@/components/Icon';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Button extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	@injectProps
	render({
		primary,
		success,
		warning,
		danger,
		dark,
		grey,
		small,
		medium,
		large,
		outline,
		loading,
		block,
		clean,
		font,
		size,
		type,
		onClick,
		disabled,
		text,
		children,
		iconRight,
		icon
	}) {
		const classButton = cx({
			button: true,
			primary: !!primary,
			success: !!success,
			warning: !!warning,
			danger: !!danger,
			dark: !!dark,
			grey: !!grey,
			small: !!small,
			medium: !!medium,
			large: !!large,
			outline: !!outline,
			loading: !!loading,
			block: !!block,
			clean: !!clean,
			iconRight: !!iconRight,
			[`${font}`]: !!font,
			[`${size}`]: !!size,
		});

		return (
			<button 
				type={type} 
				className={classButton} 
				onClick={onClick} 
				disabled={disabled}
			>
				{
					icon && !iconRight ? <Icon name={icon} /> : null
				}
				{
					text || children
				}
				{
					iconRight ? <Icon name={icon} /> : null
				}
			</button>
		);
	}
};

Button.propTypes = {
	primary: PropTypes.bool,
	success: PropTypes.bool,
	warning: PropTypes.bool,
	danger: PropTypes.bool,
	dark: PropTypes.bool,
	grey: PropTypes.bool,
	small: PropTypes.bool,
	medium: PropTypes.bool,
	large: PropTypes.bool,
	outline: PropTypes.bool,
	loading: PropTypes.bool,
	block: PropTypes.bool,
	clean: PropTypes.bool,
	font: PropTypes.string,
	size: PropTypes.string,
	type: PropTypes.string,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
	iconRight: PropTypes.bool,
	text: PropTypes.string,
	children: PropTypes.node,
	icon: PropTypes.string
};