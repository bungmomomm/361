import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

class Home extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			modalAddressShow: false,
			center: {
				lat: -6.178390, 
				lng: 106.816634
			}
		};
		this.onMarkerDragged = this.onMarkerDragged.bind(this);
		this.polygon = [
			{ lat: -6.164118, lng: 106.821247 },
			{ lat: -6.178390, lng: 106.816634 },
			{ lat: -6.172345, lng: 106.843462 }
		];
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

	render() {
		return (
			<div>
				<Helmet title='Home' />
				{
					!this.props.google ? null : (
						<Map 
							google={this.props.google} 
							zoom={14}
							setClickableIcons={false}
							initialCenter={this.state.center}
						>
							<Marker
								title={'The marker`s title will appear as a tooltip.'}
								name={'Current location'} 
								position={this.state.center}
								draggable
								onDragend={this.onMarkerDragged}
								icon={{
									url: 'http://www.iconsdb.com/icons/preview/orange/map-marker-2-xxl.png'
								}}
							/>
						</Map>
					)
				}
			</div>
		);

	}
};

export default GoogleApiWrapper({
	apiKey: ('AIzaSyDi3S2lVNeA-V8N0QXFqtLLY4rTo2ay-OQ')
})(Home);