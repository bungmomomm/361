import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../Elements/Icon/Icon';

import styles from './Tooltip.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import { isMobile } from '@/utils';

export default class Tooltip extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isMobile = isMobile();
	}

	render() {
		const TooltipWrapper = cx({
			TooltipWrapper: true,
			isMobile: this.isMobile,
			[`${this.props.position}`]: !!this.props.position,
			[`${this.props.color}`]: !!this.props.color
		});
		return (
			<div className={styles.tooltipContainer}>
				<div className={TooltipWrapper} ref={this.position}>
					<div
						className={styles.infoButton}
					>
						<span className={styles.content}>
							{
								this.props.content || null
							}
						</span>
						<Icon name='info-circle' />
					</div>
					<div className={styles.area}><span>{this.props.children}</span></div>
				</div>
			</div>
		);
	}
};

Tooltip.propTypes = {
	color: PropTypes.oneOf(['white', 'dark']),
	position: PropTypes.oneOf(['left', 'right']),
	/** Content Tooltip. */
	content: PropTypes.string
};