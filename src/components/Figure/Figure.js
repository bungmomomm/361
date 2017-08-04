import React from 'react';
import PropTypes from 'prop-types';
import styles from './Figure.scss';

const Figure = (props) => {
	return (
		<div
			className={styles.image}
			style={{
				width: props.width,
				height: props.height
			}}
		>
			<figure 
				style={{
					width: props.width,
					height: props.height
				}}
			>
				<img 
					src={props.src} 
					alt={props.alt} 
					style={{
						maxWidth: props.width,
						maxHeight: props.height
					}}
				/>
			</figure>
		</div>
	);
};

export default Figure;

Figure.propTypes = {
	src: PropTypes.string,
	alt: PropTypes.string,
	width: PropTypes.number,
	height: PropTypes.number
};