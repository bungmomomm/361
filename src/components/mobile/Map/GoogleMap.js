import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	withGoogleMap,
	GoogleMap,
	Marker,
	Circle
} from 'react-google-maps';
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';
import _ from 'lodash';

/* Create map with withGoogleMap HOC */
/* https://github.com/tomchentw/react-google-maps */

const google = window.google;

class Map extends Component {

	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			center: {
				lat: -6.24800035920893,
				lng: 106.81144165039063
			},
			mark: {
				lat: -6.24800035920893,
				lng: 106.81144165039063
			},
			markers: []
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.center.lat !== nextProps.position.lat || this.state.center.lng !== nextProps.position.lng) {
			this.setState({
				center: {
					lat: nextProps.position.lat,
					lng: nextProps.position.lng
				},
				mark: {
					lat: nextProps.position.lat,
					lng: nextProps.position.lng
				}
			});
		}
	}

	onPlacesChanged = () => {
		const places = this.searchBox.getPlaces();
		const bounds = new google.maps.LatLngBounds();

		places.forEach(place => {
			if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		const nextMarkers = places.map(place => ({
			position: place.geometry.location,
		}));
		const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

		this.setState({
			center: nextCenter,
			mark: nextCenter,
			markers: nextMarkers,
		});
		// this.map.fitBounds(bounds);
	};

	render() {
		const { center, markers, mark } = this.state;
		const {
			defaultZoom,
			handleMarkerDragEnd,
			onZoomChanged,
			radius,
			circleOptions
		} = this.props;

		const circle = (radius !== -1) ?
			(<Circle
				center={mark}
				radius={radius}
				options={circleOptions}
			/>) : null;

		return (
			<GoogleMap
				ref={(r) => { this.map = r; }}
				onZoomChanged={onZoomChanged}
				defaultZoom={defaultZoom}
				center={center}
			>
				<SearchBox
					ref={(r) => { this.searchBox = r; }}
					controlPosition={google.maps.ControlPosition.TOP_LEFT}
					onPlacesChanged={this.onPlacesChanged}
				>
					<input
						type='text'
						placeholder='Cari alamat...'
						style={{
							boxSizing: 'border-box',
							border: '1px solid transparent',
							width: '60%',
							maxWidth: `${window.innerWidth > 480 ? 480 : window.innerWidth}px`,
							height: '32px',
							marginTop: '10px',
							padding: '0 12px',
							borderRadius: '3px',
							boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
							fontSize: '14px',
							outline: 'none',
							textOverflow: 'ellipses',
						}}
					/>
				</SearchBox>

				<Marker
					draggable
					position={markers.length ? markers[0].position : mark}
					onDragEnd={(v) => {
						if (typeof handleMarkerDragEnd === 'function') handleMarkerDragEnd(v);
						this.setState({
							mark: v.latLng
						});
					}}
				/>
				{circle}
			</GoogleMap>
		);
	};

}

const mapStateToProps = () => {
	return {
		loadingElement: <div style={{ height: '100%' }} />,
		containerElement: <div style={{ height: '100%' }} />,
		mapElement: <div style={{ height: `${window.innerHeight - 60}px` }} />,
	};
};

export default connect(mapStateToProps)(withGoogleMap(Map));
