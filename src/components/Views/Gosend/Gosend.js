import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Gosend.scss';
import classNames from 'classnames/bind';
import Icon from '../../Elements/Icon/Icon';
import Input from '../../Elements/Input/Input';
import Button from '../../Elements/Button/Button';
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
			formattedAddress: '',
			icon: 'gosend-marker.png',
			autocomplete: false,
			markerInPolygon: false,
			polygonArea: this.props.polygonArea || [],
			point: {
				lat: null,
				lng: null
			}
		};
		this.showGoogleMap = this.showGoogleMap.bind(this);
		this.onMouseoverPolygon = this.onMouseoverPolygon.bind(this);
		this.onGeoLoad = this.onGeoLoad.bind(this);
		this.onSetPoint = this.onSetPoint.bind(this);
		this.renderAutocomplete = this.renderAutocomplete.bind(this);
		this.autocomplete = '';
		this.insidePolygon = '';
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.center !== nextProps.center) {
			this.setState({
				center: nextProps.center,
				polygonArea: nextProps.polygonArea,
				displayMap: false
			});
		}
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
					this.setAddress(results[0].formatted_address);
					this.props.onGeoLoad(
						lat, 
						lng,
						results[0].formatted_address
					);
					// this.hideGoogleMap();
				}
			});
		}
	}

	onSetPoint(props, marker, e) {
		this.setState({
			point: {
				lat: e.latLng.lat(),
				lng: e.latLng.lng()
			}
		});

		this.onGeoLoad(e.latLng.lat(), e.latLng.lng());

	}
	
	onMouseoverPolygon(props, polygon, e) {
		this.setCenter({
			lat: e.latLng.lat(),
			lng: e.latLng.lng()
		});
		this.onGeoLoad(e.latLng.lat(), e.latLng.lng());
	}

	onMapClicked(props) {
		console.log(props);
		console.log(this);
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

	showGoogleMap() {
		this.setState({
			displayMap: true,
			// center: this.props.center,
			// polygonArea: this.props.polygonArea
		});
	}

	hideGoogleMap() {
		// console.log(this);
		this.setState({
			displayMap: false
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
						this.setAddress(place.formatted_address);
						this.setCenter({
							lat: place.geometry.location.lat(), 
							lng: place.geometry.location.lng()
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
				<div className={styles.header}>
					<Button 
						type='button' 
						onClick={this.showGoogleMap} 
						content='Tunjukan Dalam Peta' 
						size='small' 
						color='grey' 
						icon='map-marker' 
						iconPosition='left' 
					/>
					<div className={styles.desc}>
						Lokasi peta harus sesuai dengan alamat pengiriman. Lokasi diperlukan jika ingin menggunakan jasa pengiriman GO-SEND.
					</div>
				</div>
				<div><small><em>(Optional)</em></small></div>
				{
					renderIf(this.state.displayMap)(
						<div className={styles.googleMap}>
							{
								renderIf(false)(
									<div className={styles.mapInput}>
										<Input 
											onClick={this.renderAutocomplete} 
											placeholder='Search Address'
										/>
									</div>
								)
							}
							{
								renderIf(this.props.google)(
									<Map 
										google={this.props.google} 
										zoom={12}
										className={styles.googleMapArea}
										scrollwheel={false}
										initialCenter={this.state.center}
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
											clickable={false}
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
							<Alert align='center' color='red' close>
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
	apiKey: ('AIzaSyChjpQSbwKaJOCJy_06GAwU9dNMwVq_rg4')
})(Gosend);

