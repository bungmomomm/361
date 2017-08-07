import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Tooltip.scss';
import classNames from 'classnames/bind';
import Icon from '@/components/Icon';
const cx = classNames.bind(styles);

export default class Tooltip extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			position: 'right'
		};
	}

	showTooltip(event) {
		const elem = event.target;
		const rect = elem.getBoundingClientRect();
		this.setState({
			position: 'right'
		});
		if (rect.left > rect.right) {
			this.setState({
				position: 'left'
			});
		}
	}

	render() {
		const TooltipWrapper = cx({
			TooltipWrapper: true,
			[`${this.props.position}`]: !!this.props.position,
			[`align_${this.props.align}`]: !!this.props.align
		});
		return (
			<div className={TooltipWrapper} ref={this.position}>
				<div 
					className={styles.infoButton} 
					onMouseEnter={this.showTooltip} 
					onMouseLeave={this.removeTooltip} 
				>
					<Icon name='info-circle' />
				</div>
				<div className={styles.content}>{this.props.children}</div>
			</div>
		);
	}
};

Tooltip.propTypes = {
	position: PropTypes.oneOf(['left', 'right']),
	align: PropTypes.oneOf(['left', 'right'])
};