import React from 'react';
import styles from './Gosend.scss';
import classNames from 'classnames/bind';
import { Button, Alert } from '@/components/Base';
import Icon from '@/components/Icon';
import GoogleMap from 'google-map-react';

const cx = classNames.bind(styles);

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default (props) => {
	const gosendClass = cx({
		Gosend: true
	});
	return (
		<div className={gosendClass}>
			<div className={styles.header}>
				<Button text='Tunjukan Dalam Peta' size='small' grey icon='map-marker' />
				<div className={styles.desc}>
					Lokasi peta harus sesuai dengan alamat pengiriman. Lokasi diperlukan jika ingin menggunakan jasa pengiriman GO-SEND.
				</div>
			</div>
			<div><small><em>(Optional)</em></small></div>
			<div className={styles.googleMap}>
				<GoogleMap
					bootstrapURLKeys={{ key: 'AIzaSyDi3S2lVNeA-V8N0QXFqtLLY4rTo2ay-OQ' }}
					defaultCenter={
						{ lat: 59.95, lng: 30.33 }
					}
					options={{
						scrollwheel: false
					}}
					defaultZoom={11}
				>
					<AnyReactComponent
						lat={59.955413}
						lng={30.337844}
						text={'Kreyser Avrora'}
					/>
				</GoogleMap>
				<div className={styles.mapLocationName}><Icon name='map-marker' /> Jalan Bangka II No.20</div>
				<Alert alignCenter close error>
					<em>Lokasi tidak sesuai dengan alamat pengiriman</em>
				</Alert>
			</div>
		</div>
	);
};