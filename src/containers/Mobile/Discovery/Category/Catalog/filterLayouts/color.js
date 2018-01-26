import React, { PureComponent } from 'react';
import { Header, Page, Grid, Svg, Button } from '@/components/mobile';
import { Link } from 'react-router-dom';
import styles from './color.scss';

class Color extends PureComponent {
	render() {
		const HeaderPage = {
			left: (
				<Link to='/catalogcategory'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Warna',
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.container}>
						<Grid split={5}>
							<div className={styles.list}>
								<Button><Svg src='ico_filter-biru.svg' />biru</Button>
							</div>
							<div className={styles.list}>
								<Button><Svg src='ico_filter-hijau.svg' />hijau</Button>
							</div>
							<div className={styles.list}>
								<Button><Svg src='ico_filter-hitam.svg' />hitam</Button>
							</div>
							<div className={styles.list}>
								<Button><Svg src='ico_filter-merah.svg' />merah</Button>
							</div>
							<div className={styles.list}>
								<Button><Svg src='ico_filter-orange.svg' />orange</Button>
							</div>
							<div className={styles.list}>
								<Button><Svg src='ico_filter-putih.svg' />putih</Button>
							</div>
							<div className={styles.list}>
								<Button><Svg src='ico_filter-ungu.svg' />ungu</Button>
							</div>
							<div className={styles.list}>
								<Button><Svg src='ico_filter-multi.svg' />multi</Button>
							</div>
						</Grid>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

export default Color;
