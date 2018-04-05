import React from 'react';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle
} from 'react-google-maps';

/* Create map with withGoogleMap HOC */
/* https://github.com/tomchentw/react-google-maps */

const Map = withGoogleMap((props) => {
	const {
		position,
		defaultZoom,
		handleMarkerDragEnd,
		onZoomChanged,
		radius,
		circleOptions
	} = props;

	const circle = (radius !== -1) ?
		(<Circle
			center={position}
			radius={radius}
			options={circleOptions}
		/>) : null;

	return (
		<GoogleMap
			onZoomChanged={onZoomChanged}
			defaultZoom={defaultZoom}
			defaultCenter={position}
		>
			<Marker
				draggable // Allow marker to drag
				position={position}
				onDragEnd={handleMarkerDragEnd}
			/>

			{circle}
		</GoogleMap>
	);
});

export default Map;
