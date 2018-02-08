import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './panel.scss';

class Panel extends PureComponent {
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

const Header = ({ children, className, ...props }) => {
	return (
		<div {...props} className={classNames(styles.header, className)}>{children}</div>
	);
};

const Content = ({ children, className, ...props }) => {
	return (
		<div {...props} className={classNames(styles.content, className)}>{children}</div>
	);
};

Panel.Header = Header;
Panel.Content = Content;

export default Panel;
