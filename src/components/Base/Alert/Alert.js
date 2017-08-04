import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Alert.scss';
import Icon from '@/components/Icon';
import { injectProps } from '@/decorators';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Alert extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: true
		};
	}
	@injectProps
	render({
		warning,
		success,
		error,
		alignCenter,
		icon,
		children,
		close
	}) {
		const classAlert = cx({
			Alert: true,
			warning: !!warning,
			success: !!success,
			error: !!error,
			alignCenter: !!alignCenter
		});
		return (
			this.state.show ? (
				<div className={classAlert}>
					{
						!icon ? null : <Icon className={styles.icon} />
					}
					{children}
					{
						!close ? null : (
							<button 
								type='button'
								className={styles.close}
								onClick={
									() => this.setState({ 
										show: false
									})
								}
							>
								<Icon name='times' />
							</button>
						) 
					}
				</div>
			) : null
		);
	}
};

Alert.propTypes = {
	warning: PropTypes.bool,
	success: PropTypes.bool,
	error: PropTypes.bool,
	alignCenter: PropTypes.bool,
	children: PropTypes.node,
	close: PropTypes.bool,
};