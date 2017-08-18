import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.scss';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Card = (props) => {
	const cardClass = cx({
		card: true,
		radius: !!props.radius,
		loading: !!props.loading
	});
	return (
		<div className={cardClass}>
			{props.children}
		</div>
	);
};

Card.propTypes = {
	grid: PropTypes.number,
	className: PropTypes.string
};

const Title = (props) => {
	const TitleClass = cx({
		title: true
	});
	return (
		<div className={TitleClass}>
			{props.children}
		</div>
	);
};

Card.Title = Title;

export default Card;