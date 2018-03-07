import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './timeline.scss';

class Timeline extends PureComponent {
	render() {
		const { children, className, ...props } = this.props;
		return (
			<ul className={classNames(className, styles.container)} {...props}>{children}</ul>
		);
	}
}

const Item = ({ children, className, active, ...props }) => {
	return (
		<li className={classNames(className, styles.item, active ? styles.active : null)} {...props}>
			<div className={styles.content}>{children}</div>
		</li>
	);
};

const Header = ({ children, className, ...props }) => {
	return (
		<div className={classNames(className, styles.header)} {...props}>{children}</div>
	);
};

const Content = ({ children, className, ...props }) => {
	return (
		<div className={classNames(className, styles.content)} {...props}>{children}</div>
	);
};

Timeline.Item = Item;
Timeline.Header = Header;
Timeline.Content = Content;

export default Timeline;
