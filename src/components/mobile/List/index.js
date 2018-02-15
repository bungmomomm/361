import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Svg from '../Svg';
import styles from './list.scss';

const Image = ({ children, ...props }) => {
	return (
		<div {...props} className={styles.image}>{children}</div>
	);
};

const Content = ({ children, className, ...props }) => {
	const createClassName = classNames(
		styles.content,
		className
	);
	return (
		<div {...props} className={createClassName}>{children}<Svg src='ico_chevron-right.svg' /></div>
	);
};

class List extends PureComponent {
	render() {
		const { children, className, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			className
		);

		return (
			<div className={createClassName} {...props}>
				{children}
			</div>
		);
	}
}

List.Image = Image;
List.Content = Content;


export default List;
