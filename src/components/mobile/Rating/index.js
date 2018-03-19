import React from 'react';
import Svg from '../Svg';
import _ from 'lodash';

const Rating = ({ total, active }) => {
	return (
		<div className='flex-row'>
			{
				_.times(total, (index) => {
					if (index < active) {
						return <Svg key={index} src='ico_rating-active.svg' />;
					}
					return <Svg key={index} src='ico_rating_deactive.svg' />;
				})
			}
		</div>
	);
};

export default Rating;
