import React, { Component } from 'react';
import styles from './Alert.scss';
import Icon from '@/components/Icon';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Alert extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			show: true
		};
	}
	render() {
		const classAlert = cx({
			Alert: true,
			warning: !!this.props.warning,
			success: !!this.props.success,
			error: !!this.props.error,
			alignCenter: !!this.props.alignCenter
		});
		return (
			this.state.show ? (
				<div className={classAlert}>
					{
						this.props.icon ? (
							<Icon className={styles.icon} />
						) : null
					}
					{this.props.children}
					{
						this.props.close ? (
							<button 
								type='button'
								onClick={() => this.setState({ 
									show: false
								})}
								className={styles.close}
							>
								<Icon name='times' />
							</button>
						) : null
					}
				</div>
			) : null
		);
	}
};