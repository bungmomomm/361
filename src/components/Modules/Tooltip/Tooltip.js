import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../Elements/Icon/Icon';

import styles from './Tooltip.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Tooltip extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			position: 'right'
		};
		this.showTooltip = this.showTooltip.bind(this);
	}

	showTooltip(event) {
		const elem = event.target;
		const rect = elem.getBoundingClientRect();
		this.setState({
			position: rect.left > rect.right ? 'left' : 'right'
		});
	}

	render() {
		const TooltipWrapper = cx({
			TooltipWrapper: true,
			[`${this.state.position}`]: !!this.state.position,
			[`${this.props.color}`]: !!this.props.color,
			[`align_${this.props.align}`]: !!this.props.align
		});
		return (
			<div className={TooltipWrapper} ref={this.position}>
				<div 
					className={styles.infoButton} 
					onMouseEnter={this.showTooltip} 
					onMouseLeave={this.removeTooltip} 
				>
					<span className={styles.content}>
						{
							this.props.content || null
						}
					</span>
					<Icon name='info-circle' />
				</div>
				<div className={styles.area}>{this.props.children}</div>
			</div>
		);
	}
};

Tooltip.propTypes = {
	align: PropTypes.oneOf(['left', 'right']),
	color: PropTypes.oneOf(['white', 'black']),
	content: PropTypes.string
};