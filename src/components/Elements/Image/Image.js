import React from 'react';

export default (props) => {
	const image = require(`@/assets/images/${props.src}`);
	return (
		<img alt={props.alt || ''} width={props.width || 'auto'} height={props.height || 'auto'} src={image} />
	);
};
