import React, { Component } from 'react';
import { Map, Polygon, GoogleApiWrapper } from 'google-maps-react';
import { Input } from 'mm-ui';
import styles from './GoogleMap.scss';


class GoogleMap extends Component {

	createControlClassName() {
		return [styles.control, this.props.className].join(' ').trim();
	}

	autoComplete(event) {
		const { google } = this.props;
		if (!this.renderAutoComplete) {
			this.renderAutoComplete = true;
			if (google) {
				this.autocomplete = new google.maps.places.Autocomplete(event.target, {
					componentRestrictions: { country: 'id' }
				});
				this.autocomplete.addListener('place_changed', () => {
					this.props.onChangeAutoComplete(this.autocomplete.getPlace());
				});
			}
		}
	}

	renderMarker() {
		const { marker } = this.props;
		return (
			<div role='button' tabIndex='-1' onClick={marker.onClick && marker.onClick} style={{ backgroundImage: `url(${marker.icon})` }} className={styles.centerMarker} />
		);
	}

	renderPolygon() {
		const { polygon } = this.props;
		return (
			<Polygon
				paths={polygon.area}
				strokeColor='#0000FF'
				strokeOpacity={0.8}
				strokeWeight={2}
				fillColor='#0000FF'
				fillOpacity={0.35}
				onClick={polygon.onClick}
			/>
		);
	}

	render() {
		const {
			google,
			defaultCenter,
			polygon,
			onDragend,
			centerMap
		} = this.props;
		return (
			<div className={this.createControlClassName()} style={{ width: '100%', height: '250px' }}>
				<Map
					google={google}
					zoom={15}
					scrollwheel={false}
					initialCenter={defaultCenter}
					center={centerMap}
					centerAroundCurrentLocation={false}
					style={{ width: '100%', height: '250px' }}
					onDragend={onDragend}
				>
					{polygon && this.renderPolygon()}
				</Map>
				<div id='pac-container'>
					<Input
						id='pac-input'
						onClick={(e) => this.autoComplete(e)}
						className={styles.searchLocationInput}
						placeholder='Cari Alamat'
						size='large'
						icon='search'
					/>
				</div>
				{this.renderMarker()}
			</div>
		);
	}
}

export default GoogleApiWrapper({ apiKey: ('AIzaSyBRfxjnu9S1OmoMslu7fb3uUdf3O2BNNYE') })(GoogleMap);