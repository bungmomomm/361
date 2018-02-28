import React from 'react';
import Svg from '../Svg';
import _ from 'lodash';

const Rating = ({ total, active }) => {
	return (
		<div className='flex-row'>
			{
				_.times(total, (index) => {
					if ((index + 1) <= Number(active)) {
						return <Svg key={index} src='ico_rating-active.svg' />;
					}
					if ((index + 1) > Number(active) && Number(active) < (index + 1)) {
						return <Svg key={index} src='ico_rating-half.svg' />;
					}
					return <Svg key={index} src='ico_rating_deactive.svg' />;
				})
			}
		</div>
	);
};

export default Rating;
