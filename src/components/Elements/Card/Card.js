import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.scss';

import { isMobile } from '@/utils';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


const Card = (props) => {
	const cardClass = cx({
		card: true,
		mobile: isMobile(),
		radius: !!props.radius,
		loading: !!props.loading,
		selected: !!props.selected
	});
	return (
		<div role='button' tabIndex={0} className={cardClass} onClick={props.onClick}>
			{props.children}
		</div>
	);
};

Card.propTypes = {
	grid: PropTypes.number,
	className: PropTypes.string,
	onClick: PropTypes.func
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