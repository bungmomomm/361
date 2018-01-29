import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './divider.scss';

const Content = ({ children }) => {
	return (
		<div className={styles.content}>
			{children}
		</div>
	);
};

class Divider extends PureComponent {
	render() {
		const { children, className, type, size, ...props } = this.props;

		const createClassName = classNames(styles.container, styles[size], styles[type], className);

		return (
			<div className={createClassName} {...props}>
				{children}
			</div>
		);
	}
}

Divider.Content = Content;

export default Divider;
