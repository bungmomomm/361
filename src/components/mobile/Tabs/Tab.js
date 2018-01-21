import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './tab.scss';

class Tab extends PureComponent {
	handleClick() {
		this.props.onPick(this.props.id);
	};

	render() {
		const { title, active, id } = this.props;
		const className = classNames(styles.tab, {
			[styles.active]: active
		});

		return (
			<li
				className={className}
				role='presentation'
				onClick={() => this.handleClick()}
				id={`tabs_tab_${id}`}
			>
				<span>{title}</span>
			</li>
		);
	}
}

export default Tab;
