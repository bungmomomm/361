import React, { Component } from 'react';
import Icon from '../../Elements/Icon';
import { injectProps } from '@/decorators';
import { renderIf } from '@/utils';

import styles from './Notification.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Notification extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			displayNotification: this.props.shown || false
		};
		this.handleClose = this.handleClose.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.displayNotification !== nextProps.shown) {
			this.setState({
				displayNotification: nextProps.shown
			});
		}
	}

	handleClose() {
		this.setState({
			displayNotification: false
		});
		if (this.props.onClose) {
			this.props.onClose(true);
		}
	}

	@injectProps
	render({
		content
	}) {
		const NotificationClass = cx({
			Notification: true
		});

		const NotificationWrapperClass = cx({
			wrapper: true
		});
		return (
			renderIf(this.state.displayNotification)(
				<div className={NotificationClass}>
					<div className={NotificationWrapperClass}>
						<span>{content}</span>
						<button 
							onClick={this.handleClose} 
							className={styles.close}
						>
							<Icon name='times' />
						</button>
					</div>
				</div>
			)
		);
	}
};