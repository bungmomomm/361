import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

	render() {
		const { 
			color, 
			outline, 
			block, 
			loading, 
			circular, 
			size, 
			iconPosition, 
			className,
			icon,
			content,
			children,
			...rest
		} = this.props;

		const classButton = cx({
			button: true,
			[`${color}`]: !!color,
			outline: !!outline,
			block: !!block,
			loading: !!loading,
			circular: !!circular,
			[`${size}`]: !!size,
			[`${iconPosition}`]: !!iconPosition,
			[`${className}`]: !!className
		});

		return (
			<button 
				className={classButton} 
				{...rest}
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
	circular: PropTypes.bool,
	className: PropTypes.string,
	attached: PropTypes.oneOf(['left', 'center', 'right']),
	iconPosition: PropTypes.oneOf(['left', 'right']),
	content: PropTypes.string,
	icon: PropTypes.string
};