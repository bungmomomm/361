import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './table.scss';

class Table extends PureComponent {
	render() {
		const { children, className, ...props } = this.props;

		return (
			<table className={classNames(styles.container, className)} {...props}>
				{children}
			</table>
		);
	}
}

export default Table;
