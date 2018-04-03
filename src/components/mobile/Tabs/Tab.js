import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Svg from '../Svg';
import styles from './tab.scss';

class Tab extends PureComponent {
	handleClick() {
		const { disabled } = this.props;
		if (!disabled) {
			this.props.onPick(this.props.id);
		}
		setTimeout(() => {
			// window.scrollTo(0, 0);
		}, 200);
	}

	render() {
		const { title, active, disabled, id, checked } = this.props;
		const className = classNames(styles.tab, {
			[styles.active]: active,
			[styles.disabled]: disabled
		});
		return (
			<li
				className={className}
				role='presentation'
				onClick={() => this.handleClick()}
				id={`tabs_tab_${id}`}
			>
				<span>{title}</span>
				{
					checked && <span className='margin--medium-l'><Svg src='ico_check.svg' /></span>
				}

			</li>
		);
	}
}

export default Tab;
