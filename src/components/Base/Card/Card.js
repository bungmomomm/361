import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectProps } from '@/decorators';
import classNames from 'classnames/bind';
import styles from './Card.scss';

const cx = classNames.bind(styles);

export default class Card extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	@injectProps
	render({
		radius,
		selected,
		children
	}) {
		const cardClass = cx({
			card: true,
			radius: !!radius,
			selected: !!selected
		});
		return (
			<div className={cardClass} onClick={this.props.onClick} role='button' tabIndex={0}>
				{children}
			</div>
		);
	}
};

class Title extends Card {
	@injectProps
	render({ children }) {
		const TitleClass = cx({
			Title: true
		});
		return (
			<div className={TitleClass} >
				{children}
			</div>
		);
	}
};


Card.Title = Title;

Card.propTypes = {
	radius: PropTypes.bool,
	selected: PropTypes.bool,
	onClick: PropTypes.func
};