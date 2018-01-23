import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './divider.scss';

class Divider extends PureComponent {
	render() {
		const { children, className, size, ...props } = this.props;

		const createClassName = classNames(styles.container, styles[size], className);

		return (
			<div className={createClassName} {...props}>
				{children}
			</div>
		);
	}
}

export default Divider;
