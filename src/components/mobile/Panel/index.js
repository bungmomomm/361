import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './panel.scss';

class List extends PureComponent {
	render() {
		const { children, className, ...props } = this.props;

		return (
			<div
				className={classNames(styles.container, className)}
				{...props}
			>
				{children}
			</div>
		);
	}
}

const Header = ({ children, ...props }) => {
	return (
		<div {...props} className={styles.header}>{children}</div>
	);
};

const Content = ({ children, ...props }) => {
	return (
		<div {...props} className={styles.content}>{children}</div>
	);
};

List.Header = Header;
List.Content = Content;

export default List;
