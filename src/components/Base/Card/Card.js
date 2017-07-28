import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './Card.scss';

const cx = classNames.bind(styles);

export default class Card extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	render() {
		const cardClass = cx({
			card: true,
			radius: !!this.props.radius,
			selected: !!this.props.selected
		});
		return (
			<div className={cardClass}>
				{this.props.children}
			</div>
		);
	}
};

class Title extends Card {
	render() {
		const TitleClass = cx({
			Title: true
		});
		return (
			<div className={TitleClass}>
				{this.props.children}
			</div>
		);
	}
};


Card.Title = Title;