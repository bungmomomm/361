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
			PositionLeft: true,
			displayMap: false,
			center: {
				lat: -6.178390, 
				lng: 106.816634
			},
			icon: 'gosend-marker.png'
		};
		this.showGoogleMap = this.showGoogleMap.bind(this);
		this.onMarkerDragged = this.onMarkerDragged.bind(this);
	}

	onMarkerDragged(props, marker, e) {
		const locDragged = {
			lat: e.latLng.lat(), 
			lng: e.latLng.lng()
		};
		this.setState({
			center: locDragged
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

	render() {
		const gosendClass = cx({
			Gosend: true
		});

		return (
			<div className={gosendClass}>
				<div className={styles.header}>
					<Button onClick={this.showGoogleMap} text='Tunjukan Dalam Peta' size='small' grey icon='map-marker' />
					<div className={styles.desc}>
						Lokasi peta harus sesuai dengan alamat pengiriman. Lokasi diperlukan jika ingin menggunakan jasa pengiriman GO-SEND.
					</div>
				</div>
				<div><small><em>(Optional)</em></small></div>
				{
					this.state.displayMap ? (
						<div className={styles.googleMap}>
							<Input placeholder='Search Address' />
							{
								!this.props.google ? null : (
									<Map 
										google={this.props.google} 
										zoom={14}
										setClickableIcons={false}
										scrollwheel={false}
										initialCenter={this.state.center}
									>
										<Marker
											title={'The marker`s title will appear as a tooltip.'}
											name={'Current location'} 
											position={this.state.center}
											draggable
											onDragend={this.onMarkerDragged}
											icon={{
												url: this.markerIcon
											}}
										/>
									</Map>
								)
							}
							<div className={styles.mapLocationName}><Icon name='map-marker' /> Jalan Bangka II No.20</div>
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