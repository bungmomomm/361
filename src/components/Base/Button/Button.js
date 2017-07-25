import React, { Component } from 'react';
import styles from './Button.scss';
import Icon from '@/components/Icon';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Alert extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	render() {
		const classButton = cx({
			button: true,
			primary: !!this.props.primary,
			success: !!this.props.success,
			warning: !!this.props.warning,
			danger: !!this.props.danger,
			small: !!this.props.small,
			medium: !!this.props.medium,
			large: !!this.props.large,
			outline: !!this.props.outline,
			loading: !!this.props.loading,
			block: !!this.props.block,
			clean: !!this.props.clean,
			[`${this.props.font}`]: !!this.props.font
		});

		return (
			<button className={classButton} disabled={this.props.disabled}>
				{
					this.props.icon ? <Icon name={this.props.icon} /> : null
				}
				{
					this.props.text ? this.props.text : this.props.children
				}
			</button>
		);
	}
};