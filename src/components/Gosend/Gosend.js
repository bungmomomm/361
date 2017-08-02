import React, { Component } from 'react';
import styles from './Gosend.scss';
import classNames from 'classnames/bind';
import { Input, Button, Alert } from '@/components/Base';
import Icon from '@/components/Icon';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

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
			autocomplete: false
		};
		this.showGoogleMap = this.showGoogleMap.bind(this);
		this.onMarkerDragged = this.onMarkerDragged.bind(this);
		this.renderAutocomplete = this.renderAutocomplete.bind(this);
		this.autocomplete = '';
	}

	componentDidUpdate(prevProps) {
		const { map } = this.props;
		if (map !== prevProps.map) {
			this.renderAutoComplete();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.autocomplete, false);
	}

	onMarkerDragged(props, marker, e) {
		this.setCenter({
			lat: e.latLng.lat(), 
			lng: e.latLng.lng()
		});
	}

	setCenter(location) {
		this.setState({
			center: location
		});
	}

	setAddress(address) {
		this.setState({
			formattedAddress: address
		});
	}

	showGoogleMap() {
		this.setState({
			displayMap: true
		});
	}

	get markerIcon() {
		return require(`../../assets/images/${this.state.icon}`);
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
					<Button type='button' onClick={this.showGoogleMap} text='Tunjukan Dalam Peta' size='small' grey icon='map-marker' />
					<div className={styles.desc}>
						Lokasi peta harus sesuai dengan alamat pengiriman. Lokasi diperlukan jika ingin menggunakan jasa pengiriman GO-SEND.
					</div>
				</div>
				<div><small><em>(Optional)</em></small></div>
				{
					this.state.displayMap ? (
						<div className={styles.googleMap}>
							<div className={styles.mapInput}>
								<Input 
									onClick={this.renderAutocomplete} 
									placeholder='Search Address'
								/>
							</div>
							{
								!this.props.google ? null : (
									<Map 
										google={this.props.google} 
										zoom={14}
										className={styles.googleMapArea}
										scrollwheel={false}
										initialCenter={this.state.center}
										center={this.state.center}
										centerAroundCurrentLocation={false}
									>
										<Marker
											title={'The marker`s title will appear as a tooltip.'}
											name={'Current location'} 
											position={this.state.center}
											draggable
											onDragend={this.onMarkerDragged}
											setClickableIcons={false}
											icon={{
												url: this.markerIcon
											}}
										/>
									</Map>
								)
							}
							<div className={styles.mapLocationName}>
								<Icon name='map-marker' /> <span>{this.state.formattedAddress}</span>
							</div>
							<Alert alignCenter close error>
								<em>Lokasi tidak sesuai dengan alamat pengiriman</em>
							</Alert>
						</div>
					) : null
				}
			</div>
		);
	}
};

export default GoogleApiWrapper({
	apiKey: ('AIzaSyDi3S2lVNeA-V8N0QXFqtLLY4rTo2ay-OQ')
})(Gosend);