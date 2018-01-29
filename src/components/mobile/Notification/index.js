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
			disableClose,
			...props,
		} = this.props;

		const createClassName = classNames(
			styles.container,
			styles[color],
			className
		);

		if (!show) {
			return null;
		}

		return (
			<div className={createClassName} {...props} >
				{children}
				{
					!disableClose && (
						<div className={styles.close}>
							<Button onClick={(e) => onClose(e)} ><Svg src='ico_close.svg' /></Button>
						</div>
					)
				}
			</div>
		);
	}
}

export default Notification;
