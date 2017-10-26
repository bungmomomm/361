import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './Gosend.scss';
import classNames from 'classnames/bind';
import Icon from '../../Elements/Icon/Icon';
import Input from '../../Elements/Input/Input';
import Alert from '../../Modules/Alert/Alert';
import { Map, Marker, Polygon, GoogleApiWrapper } from 'google-maps-react';
import { Polygon as PolygonDistrict } from '@/data/polygons';

const cx = classNames.bind(styles);

class Gosend extends Component {

	static getPolygonData(kecamatan) {
		const district = kecamatan.toLowerCase().replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
		const dataSelectedPolygon = _.find(PolygonDistrict, district);
		return dataSelectedPolygon[district] || null;
	}
	
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			formattedAddress: ''
		};
		this.selectedPolygon = this.constructor.getPolygonData(this.props.kecamatan);
		this.icon = 'gosend-marker.png';
	}

	setPinPoint(props, marker, e) {
		this.getFormattedAddress(e.latLng.lat(), e.latLng.lng());
	}

	getFormattedAddress(lat, lng) {
		const { google } = this.props;
		const geo = new google.maps.Geocoder();
		const latLng = new google.maps.LatLng(lat, lng);
		geo.geocode({ latLng }, (results, status) => {
			if (status === google.maps.GeocoderStatus.OK) {
				this.setAddress(results[0].formatted_address);
			}
		});
	}

	setAddress(formattedAddress) {
		this.setState({
			formattedAddress
		});
		this.props.onSelectedPinPoint({
			formattedAddress 
		});
	}
	
	get markerIcon() {
		return require(`@/assets/images/${this.icon}`);
	}

	render() {
		const gosendClass = cx({
			Gosend: true
		});
		if (!this.props.kecamatan) {
			return null;
		}
		return (
			<div className={gosendClass}>
				<div className={styles.googleMap}>
					<div className={styles.mapInput}>
						<Input placeholder='Search Address' />
					</div>
					<Map
						google={this.props.google}
						zoom={this.props.zoom}
						className={styles.googleMapArea}
						scrollwheel={false}
						initialCenter={this.selectedPolygon.center}
						centerAroundCurrentLocation={false}
					>
						<Polygon
							paths={this.selectedPolygon.location_coords}
							strokeColor='#0000FF'
							strokeOpacity={0.8}
							strokeWeight={2}
							fillColor='#0000FF'
							fillOpacity={0.35} 
						/>
						<Marker
							title={'The marker`s title will appear as a tooltip.'}
							name={'Current location'} 
							position={this.selectedPolygon.center}
							clickable
							icon={{ url: this.markerIcon }}
							onClick={(props, marker, e) => this.setPinPoint(props, marker, e)}
						/>
					</Map>
					<div className={styles.mapLocationName}>
						<Icon name='map-marker' /> 
						<span>{this.state.formattedAddress}</span>
					</div>
					<Alert align='center' color='red' show>
						<em>`${'Lokasi tidak sesuai dengan alamat pengiriman'}`</em>
					</Alert>
				</div>
			</div>
		);
	}
};


Gosend.propTypes = {
	center: PropTypes.object,
	google: PropTypes.object
};

export default GoogleApiWrapper({
	apiKey: (process.env.GOOGLE_MAP_API_KEY)
})(Gosend);

