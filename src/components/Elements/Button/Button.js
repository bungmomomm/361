import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { injectProps } from '@/decorators';
import Icon from '../Icon/Icon';
import { renderIf } from '@/utils';

import styles from './Button.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Button extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	};

	@injectProps
	render({
		className,
		block,
		color,
		outline,
		loading,
		size,
		type,
		circular,
		onClick,
		disabled,
		iconPosition,
		content,
		children,
		icon,
		tabIndex
	}) {
		const classButton = cx({
			button: true,
			[`${color}`]: !!color,
			outline: !!outline,
			block: !!block,
			loading: !!loading,
			circular: !!circular,
			[`${size}`]: !!size,
			[`iconPosition_${iconPosition}`]: !!iconPosition,
			[`${className}`]: !!className
		});

		return (
			<button 
				id={this.props.id}
				type={type} 
				className={classButton} 
				onClick={onClick} 
				disabled={disabled}
				tabIndex={tabIndex}
			>
				{
					renderIf(iconPosition === 'left' || circular)(
						<Icon name={icon} />
					)
				}
				{
					content || children
				}
				{
					renderIf(iconPosition === 'right')(
						<Icon name={icon} />
					)
				}
			</button>
		);
	}
};

Button.propTypes = {
	color: PropTypes.oneOf(['red', 'yellow', 'orange', 'green', 'grey', 'dark']),
	outline: PropTypes.bool,
	loading: PropTypes.bool,
	block: PropTypes.bool,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	type: PropTypes.string,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
	circular: PropTypes.bool,
	className: PropTypes.string,
	attached: PropTypes.oneOf(['left', 'center', 'right']),
	iconPosition: PropTypes.oneOf(['left', 'right']),
	content: PropTypes.string,
	icon: PropTypes.string
};