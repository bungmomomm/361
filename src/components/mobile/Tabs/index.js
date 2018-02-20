import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Tab from './Tab';
import styles from './tab.scss';

class Tabs extends PureComponent {
	render() {
		const { current, variants, className, type, onPick, ...props } = this.props;
		const createClassName = classNames(styles.container, className, styles[type]);

		const tabs = variants.map(({ id, title, key }, idx) => {
			const active = id === current;
			return (
				<Tab
					id={id}
					key={idx}
					title={title}
					active={active}
					onPick={onPick}
				/>
			);
		});

		return <ul className={createClassName} {...props}>{tabs}</ul>;
	}
}

export default Tabs;
