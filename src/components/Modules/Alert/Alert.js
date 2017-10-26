import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Alert.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

import Icon from '../../Elements/Icon';
import { renderIf } from '@/utils';
import { injectProps } from '@/decorators';

/**
 * A Alert is used to create a Alert content.
 */
export default class Alert extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: this.props.show || false
		};
		this.handleClose = this.handleClose.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.show !== nextProps.show) {
			this.setState({ show: nextProps.show });
		}
	}

	handleClose() {
		this.setState({ show: false });
	}

	@injectProps
	render({
		icon,
		children,
		close,
		color,
		align
	}) {

		const classAlert = cx({
			alert: true,
			[`${color}`]: !!color,
			[`${align}`]: !!align
		});

		const IconElement = (
			renderIf(icon)(
				<Icon name={icon} />
			)
		);

		const ButtonClose = (
			renderIf(close)(
				<button
					type='button'
					className={styles.close}
					onClick={this.handleClose}
				>
					<Icon name='times' />
				</button>
			)
		);

		return (
			renderIf(this.state.show)(
				<div className={classAlert}>
					{IconElement}
					<span dangerouslySetInnerHTML={{ __html: children }} />
					{ButtonClose}
				</div>
			)
		);
	}
};

Alert.propTypes = {
	/** Alert can be colored. */
	color: PropTypes.oneOf(['red', 'yellow', 'orange', 'green', 'grey', 'dark']),

	/** Formats content to be aligned. */
	align: PropTypes.oneOf(['left', 'center', 'right']),

	/** A segment may be formatted to close. */
	close: PropTypes.bool,

	show: PropTypes.bool
};
