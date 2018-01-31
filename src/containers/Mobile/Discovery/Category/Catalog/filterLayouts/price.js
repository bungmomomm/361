import React, { PureComponent } from 'react';
import { Button, Header, Page, Svg, List, Slider } from '@/components/mobile';
import { Link } from 'react-router-dom';
import styles from './price.scss';
import Action from './action';

class Price extends PureComponent {
	render() {
		const HeaderPage = {
			left: (
				<Link to='/catalogcategory'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Harga',
			right: null
		};

		// to do: use below logic when implement
		// const icon = false ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
		const icon = <Svg src='ico_check.svg' />;
		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.priceSlider}>
						<div className={styles.sliderLabel}>
							<span>50.000</span>
							<span>10.0000</span>
						</div>
						<Slider min={50000} max={100000} onChange={(e) => console.log(e)} />
						<div className={styles.sliderInfo}>
							<span>min</span>
							<span>max</span>
						</div>
					</div>
					<div>
						<List><List.Content>15.000 - 200.0000 {icon}</List.Content></List>
						<List><List.Content>20.000 - 300.0000 {icon}</List.Content></List>
					</div>
					<div className={styles.action}>
						<Button wide size='medium' outline color='secondary'>App Only</Button>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default Price;
