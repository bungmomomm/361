import React, { PureComponent } from 'react';
import { Header, Page, Grid, Svg, Button, Badge } from '@/components/mobile';
import styles from './color.scss';
import Action from './action';
import _ from 'lodash';

class Color extends PureComponent {
	render() {
		const { onClose, filters, onClick } = this.props;
		const colors = _.filter(filters.facets, (facet) => facet.id === 'color');
		let colorFilters = [];
		if (colors.length > 0) {
			colorFilters = colors[0].data;
		}
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: 'Warna',
			right: null
		};
		const colorList = _.map(colorFilters, (color, key) => {
			return (
				<div className={styles.list} key={key}>
					<Button onClick={(e) => onClick(e, color)}><Badge circle colorCode={color.colorcode} size='medium' filter={color} >{color.facetdisplay}</Badge></Button>
				</div>
			);
		});

		console.log(colorList);

		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.container}>
						<Grid split={5}>
							{colorList}
							{/* <div className={styles.list}>
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
							</div> */}
						</Grid>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default Color;
