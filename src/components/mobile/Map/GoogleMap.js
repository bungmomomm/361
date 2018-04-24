import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	withGoogleMap,
	GoogleMap,
	Marker,
	// Circle,
	Polygon
} from 'react-google-maps';
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';
import _ from 'lodash';
import { actions } from '@/state/v4/Address';

/* Create map with withGoogleMap HOC */
/* https://github.com/tomchentw/react-google-maps */

const google = window.google;

class Map extends Component {

	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			center: {
				lat: 0,
				lng: 0
			},
			mark: {
				lat: 0,
				lng: 0
			},
			markers: [],
			validMarker: true
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.position !== nextProps.position) {
			const { polygon } = this.props;
			const latLng = new google.maps.LatLng(nextProps.position.lat, nextProps.position.lng);
			const isValidMarkerPosition = polygon ? this.isValidPosition(latLng) : true;

			this.setState({
				center: {
					lat: nextProps.position.lat,
					lng: nextProps.position.lng
				},
				mark: {
					lat: nextProps.position.lat,
					lng: nextProps.position.lng
				},
				validMarker: isValidMarkerPosition
			});
		}
	}

	onDragEnd = (v) => {
		const { polygon, dispatch, handleMarkerDragEnd } = this.props;
		const latLng = new google.maps.LatLng(v.latLng.lat(), v.latLng.lng());

		const isValidMarkerPosition = polygon ? this.isValidPosition(latLng) : true;
		dispatch(actions.mutateState({
			validMarker: isValidMarkerPosition
		}));

		if (typeof handleMarkerDragEnd === 'function') handleMarkerDragEnd(v);
		this.setState({
			center: v.latLng,
			mark: v.latLng,
			validMarker: isValidMarkerPosition
		});
	};

	autoComplete = (e) => {
		const { handleMarkerDragEnd } = this.props;

		const autocomplete = new google.maps.places.Autocomplete(e.target, {
			componentRestrictions: { country: 'id' }
		});
		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();
			const bounds = new google.maps.LatLngBounds();

			if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}

			const nextMarkers = [{
				position: place.geometry.location,
			}];

			const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
			const latLng = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());

			const { polygon, dispatch } = this.props;
			const isValidMarkerPosition = polygon ? this.isValidPosition(latLng) : true;
			dispatch(actions.mutateState({
				validMarker: isValidMarkerPosition
			}));

			if (typeof handleMarkerDragEnd === 'function') {
				handleMarkerDragEnd({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
			};

			this.setState({
				center: nextCenter,
				mark: nextCenter,
				markers: nextMarkers,
				validMarker: isValidMarkerPosition
			});
		});
	};

	isValidPosition = (e) => {
		const { polygon } = this.props;
		const polygonArea = new google.maps.Polygon({ paths: polygon.location_coords });
		return !!google.maps.geometry.poly.containsLocation(e, polygonArea);
	};

	errorNotif = (msg) => {
		return (
			<div
				style={{
					backgroundColor: 'rgba(229, 0, 34, 0.9)',
					border: '1px solid #b7001b',
					borderLeft: 'none',
					padding: '5px 10px',
					color: '#fff',
					borderTopRightRadius: '4px',
					borderBottomRightRadius: '4px',
					marginTop: '-100px',
					width: '85%',
					textAlign: 'right'
				}}
			>
				{msg}
			</div>
		);
	};

	render() {
		const { center, mark, validMarker } = this.state;
		const {
			defaultZoom,
			onZoomChanged,
			polygon
		} = this.props;

		return (
			<GoogleMap
				onZoomChanged={onZoomChanged}
				defaultZoom={defaultZoom}
				center={center}
				options={{
					gestureHandling: 'greedy',
					disableDoubleClickZoom: true
				}}
			>
				<SearchBox
					controlPosition={google.maps.ControlPosition.TOP_LEFT}
				>
					<input
						type='text'
						onClick={(e) => this.autoComplete(e)}
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
					ref={(r) => { this.marker = r; }}
					draggable
					position={mark}
					onDragEnd={this.onDragEnd}
					icon={{
						url: require('@/assets/images/mobile/mm_ico_pinlocation_large.png')
					}}
				/>

				{!validMarker && this.errorNotif('Lokasi tidak sesuai dengan alamat pengiriman')}
				{polygon && (<Polygon
					paths={polygon.location_coords}
					options={{
						strokeColor: '#02b238',
						strokeOpacity: '0.8',
						strokeWeight: '2',
						fillColor: '#02b238',
						fillOpacity: '0.25'
					}}
				/>)}
			</GoogleMap>
		);
	};

}

const mapStateToProps = (state) => {
	return {
		loadingElement: <div style={{ height: '100%' }} />,
		containerElement: <div style={{ height: '100%' }} />,
		mapElement: <div style={{ height: `${window.innerHeight - 60}px` }} />,
		polygon: state.address.polygon,
		edit: state.address.edit
	};
};

export default connect(mapStateToProps)(withGoogleMap(Map));
