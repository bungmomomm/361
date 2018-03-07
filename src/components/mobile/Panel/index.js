import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './panel.scss';

class Panel extends PureComponent {
	render() {
		const { children, className, ...props } = this.props;
		const panelClass = classNames(
			styles.container,
			className,
			this.props.color ? styles[this.props.color] : null,
			this.props.rounded ? styles.rounded : null
		);
		return (
			<div
				className={panelClass}
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
