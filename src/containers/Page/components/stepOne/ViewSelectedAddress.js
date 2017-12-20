import React from 'react';

const ViewSelectedAddress = (props) => {
	return (
		<p>
			<strong>{props.addressLabel}</strong> <br />
			{props.fullname} <br />
			{props.address} <br />
			{props.district}, 
			{props.city}, 
			{props.province}, 
			{props.zipcode} <br />
			Telepon: {props.phone}
		</p>
	);
};

export default ViewSelectedAddress;