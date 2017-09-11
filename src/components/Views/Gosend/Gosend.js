import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Gosend.scss';
import classNames from 'classnames/bind';
import Icon from '../../Elements/Icon/Icon';
import Input from '../../Elements/Input/Input';
import Alert from '../../Modules/Alert/Alert';
import { Map, Marker, Polygon, GoogleApiWrapper } from 'google-maps-react';
import { renderIf } from '@/utils';

const cx = classNames.bind(styles);

class Gosend extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			displayMap: false,
			center: this.props.center,
			centerMap: {},
			formattedAddress: '',
			icon: 'gosend-marker.png',
			outSideMap: 'in',
			autocomplete: false,
			markerInPolygon: false,
			polygonArea: this.props.polygonArea || [],
			point: {
				lat: null,
				lng: null
			}
		};
		this.toggleGoogleMap = this.toggleGoogleMap.bind(this);
		this.onMouseoverPolygon = this.onMouseoverPolygon.bind(this);
		this.onGeoLoad = this.onGeoLoad.bind(this);
		this.onSetPoint = this.onSetPoint.bind(this);
		this.renderAutocomplete = this.renderAutocomplete.bind(this);
		this.autocomplete = '';
		this.insidePolygon = '';
	}
	
	componentWillMount() {
		this.setState({
			center: this.props.center,
			polygonArea: this.props.polygonArea
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			displayMap: nextProps.displayMap
		});
	}

	componentDidUpdate(prevProps) {
		const { map } = this.props;
		
		if (this.props.isCustomerData) {
			this.onGeoLoad(this.props.center.lat, this.props.center.lng);
		}
		
		if (map !== prevProps.map) {
			this.renderAutoComplete();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.autocomplete, false);
	}

	onGeoLoad(lat, lng) {
		const { google } = this.props;
		if (google) {
			const geo = new google.maps.Geocoder();
			const latLng = new google.maps.LatLng(lat, lng);
			geo.geocode({ latLng }, (results, status) => {
				if (status === google.maps.GeocoderStatus.OK) {
					this.props.onGeoLoad(
						latLng.lat(), 
						latLng.lng(),
						results[0].formatted_address
					);
					this.setAddress(results[0].formatted_address);
				}
			});
		}
	}

	onSetPoint(props, marker, e) {
		if (this.state.outSideMap === 'in') {
			this.onGeoLoad(e.latLng.lat(), e.latLng.lng());
			this.setState({
				point: {
					lat: e.latLng.lat(),
					lng: e.latLng.lng(),
				}
			});
			this.props.onSetPoint(true, this.state.formattedAddress, {
				lat: e.latLng.lat(),
				lng: e.latLng.lng(),
			});
		} else {
			this.setState({
				outSideMap: 'out'
			});
		}
	}
	
	onMouseoverPolygon(props, polygon, e) {
		this.setCenter({
			lat: e.latLng.lat(),
			lng: e.latLng.lng()
		});
		this.onGeoLoad(e.latLng.lat(), e.latLng.lng());
	}

	setCenter(location) {
		this.setState({
			center: location,
			markerInPolygon: false
		});
	}

	setAddress(address) {
		this.setState({
			formattedAddress: address
		});
	}

	get markerIcon() {
		return require(`@/assets/images/${this.state.icon}`);
	}

	toggleGoogleMap() {
		this.setState({
			displayMap: !this.state.displayMap
		});
	}

	renderAutocomplete(event) {
		if (!this.state.autocomplete) {
			const { google, map } = this.props;
			this.setState({
				autocomplete: true
			});
			if (google || map) {
				this.autocomplete = new google.maps.places.Autocomplete(event.target);
				this.autocomplete.addListener('place_changed', () => {
					const place = this.autocomplete.getPlace();
					if (place.geometry) {
						const latLng = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
						const polygonArea = new google.maps.Polygon({ paths: this.state.polygonArea });
						const isInPolygon = google.maps.geometry.poly.containsLocation(latLng, polygonArea) ? 'in' : 'out';
						if (place.formatted_address) {
							this.setAddress(place.formatted_address);
						}
						const center = {
							lat: place.geometry.location.lat(), 
							lng: place.geometry.location.lng()
						};
						this.setState({
							center,
							centerMap: center,
							outSideMap: isInPolygon
						});
					}
				});
			};
		}
	}

	render() {
		const gosendClass = cx({
			Gosend: true
		});
		return (
			<div className={gosendClass}>
				{
					renderIf(this.state.displayMap)(
						<div className={styles.googleMap}>
							{
								renderIf(true)(
									<div className={styles.mapInput}>
										<Input 
											onClick={this.renderAutocomplete} 
											placeholder='Search Address'
										/>
									</div>
								)
							}
							{
								renderIf(this.props.google && this.state.center && this.state.polygonArea)(
									<Map 
										google={this.props.google} 
										zoom={15}
										className={styles.googleMapArea}
										scrollwheel={false}
										initialCenter={this.state.center}
										center={this.state.centerMap}
										centerAroundCurrentLocation={false}
									>
										<Polygon
											paths={this.state.polygonArea}
											strokeColor='#0000FF'
											strokeOpacity={0.8}
											strokeWeight={2}
											fillColor='#0000FF'
											onClick={this.onMouseoverPolygon}
											fillOpacity={0.35} 
										/>
										<Marker
											title={'The marker`s title will appear as a tooltip.'}
											name={'Current location'} 
											position={this.state.center}
											clickable
											icon={{
												url: this.markerIcon
											}}
											onClick={this.onSetPoint}
										/>
									</Map>
								)
							}
							<div className={styles.mapLocationName}>
								<Icon name='map-marker' /> 
								<span>{this.state.formattedAddress}</span>
							</div>
							<Alert align='center' color='red' show={this.state.outSideMap === 'out' || false}>
								<em>Lokasi tidak sesuai dengan alamat pengiriman</em>
							</Alert>
						</div>
					)
				}
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

