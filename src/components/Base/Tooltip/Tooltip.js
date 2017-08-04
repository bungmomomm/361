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
			PositionLeft: true
		};
	}

	showTooltip(event) {
		const elem = event.target;
		const rect = elem.getBoundingClientRect();
		this.setState({
			PositionLeft: true
		});
		if (rect.left > rect.right) {
			this.setState({
				PositionLeft: false
			});
		}
	}

	render() {
		const TooltipWrapper = cx({
			TooltipWrapper: true,
			right: !!this.props.right,
			PosLeft: !!this.state.PositionLeft
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
	right: PropTypes.bool,
	children: PropTypes.node
};