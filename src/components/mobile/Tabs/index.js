import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Tab from './Tab';
import styles from './tab.scss';

class Tabs extends PureComponent {
	render() {
		const { current, variants, onPick, ...props } = this.props;
		const className = classNames(styles.container, this.props.className);

		const tabs = variants.map(({ id, title }) => {
			const active = id === current;
			return (
				<Tab
					id={id}
					key={id}
					title={title}
					active={active}
					onPick={onPick}
				/>
			);
		});

		return <ul className={className} {...props}>{tabs}</ul>;
	}
}

export default Tabs;
