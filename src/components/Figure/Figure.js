import React from 'react';
import styles from './Figure.scss';

export default (props) => {
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