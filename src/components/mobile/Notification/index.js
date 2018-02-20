import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './notification.scss';
import Button from '../Button';
import Svg from '../Svg';

class Notification extends PureComponent {
	render() {
		const {
			className,
			children,
			show,
			onClose,
			color,
			toast,
			disableClose,
			alert,
			...props,
		} = this.props;

		const createClassName = classNames(
			styles.container,
			styles[color],
			show ? styles.show : styles.hide,
			toast ? styles.toast : null,
			className
		);

		const createClassNameToast = classNames(
			styles.toastContainer,
			show ? styles.showToast : styles.hideToast
		);
	
		const createClassNameAlert = classNames(
			styles.toastContainer,
			show ? styles.showToast : styles.hideToast
		);

		const renderNotification = () => {
			return (
				<div className={createClassName} {...props} >
					{children}
					{
						!disableClose && (
							<div className={styles.close}>
								<Button onClick={(e) => onClose(e)}><Svg src='ico_close.svg' /></Button>
							</div>
						)
					}
				</div>
			);
		};

		if (alert) {
			return (
				<div className={createClassNameAlert}>
					{renderNotification()}
				</div>
			);
		}

		if (toast) {
			return (
				<div className={createClassNameToast} onClick={(e) => onClose(e)} role='button' tabIndex='0'>
					{renderNotification()}
				</div>
			);
		}

		return renderNotification();
	}
}

export default Notification;
