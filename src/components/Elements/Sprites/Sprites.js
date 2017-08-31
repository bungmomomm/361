import React from 'react';
import PropTypes from 'prop-types';
import styles from './Sprites.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Background = require('@/assets/images/sprites@2x.png');


const Sprites = (props) => {
	const classSprites = cx({
		sprites: true,
		[`Sprites__${props.name}`]: !!props.name,
	});
	return (
		<i style={{ backgroundImage: `url(${Background})`, backgroundSize: '839px' }} className={classSprites} />
	);
};

export default Sprites;

Sprites.propTypes = {
	name: PropTypes.string
};