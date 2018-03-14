import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Tab from './Tab';
import styles from './tab.scss';

class Tabs extends PureComponent {
	render() {
		const { activeTab, current, variants, className, type, onPick, style } = this.props;
		const createClassName = classNames(
			styles.container,
			className,
			styles[type]
		);

		const tabs = variants.map(({ id, title, key, disabled }, idx) => {
			const activeId = activeTab ? (activeTab === id) : (key === current);
			return (
				<Tab
					id={id}
					key={idx}
					title={title}
					active={activeId}
					disabled={disabled}
					onPick={onPick}
				/>
			);
		});

		return (
			<ul className={createClassName} style={style}>
				{tabs}
			</ul>
		);
	}
}

export default Tabs;
