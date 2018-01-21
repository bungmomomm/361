import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './notification.scss';
import Button from '../Button';

class Notification extends PureComponent {
	render() {
		const {
			active,
			className,
			children
		} = this.props;
		const createClassName = classNames(
			styles.container, 
			{
				[styles.active]: active
			},
			className
		);

		return (
			<div className={createClassName} >
				{children}
				<div>
					<Button>X</Button>
				</div>
			</div>
		);
	}
}

export default Notification;
