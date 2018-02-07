import React, { PureComponent } from 'react';
import { Button, Header, Page, Svg, List, Slider } from '@/components/mobile';
// import { Link } from 'react-router-dom';
import styles from './price.scss';
import Action from './action';
import _ from 'lodash';

class Price extends PureComponent {
	render() {
		const { onClose, onClick, prices, range } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: 'Harga',
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.priceSlider}>
						<div className={styles.sliderLabel}>
							<span>{range.min}</span>
							<span>{range.max}</span>
						</div>
						<Slider min={range.min} max={range.max} onChange={(e) => console.log(e)} />
						<div className={styles.sliderInfo}>
							<span>min</span>
							<span>max</span>
						</div>
					</div>
					<div>
						{ _.map(prices, (price) => {
							const icon = price.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
							return (
								<List><Button onClick={(e) => onClick(e, price)}><List.Content>{price.facetdisplay} {icon}</List.Content></Button></List>
							);
						})}
					</div>
					{/* <div className={styles.action}>
						<Button wide size='medium' outline color='secondary'>App Only</Button>
					</div> */}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default Price;
