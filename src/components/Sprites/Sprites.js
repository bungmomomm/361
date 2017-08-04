import React from 'react';
import PropTypes from 'prop-types';
import styles from './Sprites.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Sprites = (props) => {
	const classSprites = cx({
		sprites: true,
		[`sprites__${props.name}`]: !!props.name,
	});
	return (
		<i className={classSprites} />
	);
};

export default Sprites;

Sprites.propTypes = {
	name: PropTypes.string
};