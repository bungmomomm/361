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
			noMargin: !!this.props.noMargin
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
			Level: true,
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
			Level: true,
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
			Level: true,
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