import React, { Component } from 'react';
import styles from './Level.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Level extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const levelClass = cx({
			Level: true,
			noMargin: !!this.props.noMargin,
			padded: !!this.props.padded
		});
		return (
			<div className={levelClass}>
				{this.props.children}
			</div>
		);
	}
};

class Item extends Level {
	render() {
		const ItemClass = cx({
			item: true
		});
		return (
			<div className={ItemClass}>
				{this.props.children}
			</div>
		);
	}
};
class Left extends Level {
	render() {
		const ItemClass = cx({
			left: true
		});
		return (
			<div className={ItemClass}>
				{this.props.children}
			</div>
		);
	}
};

class Right extends Level {
	render() {
		const ItemClass = cx({
			right: true
		});
		return (
			<div className={ItemClass}>
				{this.props.children}
			</div>
		);
	}
};


Level.Item = Item;
Level.Left = Left;
Level.Right = Right;