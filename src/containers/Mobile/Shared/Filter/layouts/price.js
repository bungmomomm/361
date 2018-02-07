import React, { PureComponent } from 'react';
import { Button, Header, Page, Svg, List, Slider } from '@/components/mobile';
// import { Link } from 'react-router-dom';
import styles from './price.scss';
import Action from './action';
import _ from 'lodash';

class Price extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			range: {
				min: parseInt(props.range.min, 10),
				max: parseInt(props.range.max, 10)
			}
		};
	}

	updateRange(value) {
		const { onChange, range } = this.props;
		this.setState({
			range: {
				min: Math.abs(value.min) < parseInt(range.max, 10) ? Math.abs(value.min) : parseInt(range.min, 10),
				max: Math.abs(value.max) < parseInt(range.max, 10) ? Math.abs(value.max) : parseInt(range.max, 10),
			}
		});

		onChange(undefined, value);
	}

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
							<span>{this.state.range.min}</span>
							<span>{this.state.range.max}</span>
						</div>
						<Slider min={parseInt(range.min, 10)} max={parseInt(range.max, 10)} value={this.state.range} onChange={(value) => this.updateRange(value)} />
						<div className={styles.sliderInfo}>
							<span>min</span>
							<span>max</span>
						</div>
					</div>
					<div>
						{ _.map(prices, (price, id) => {
							const icon = price.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
							return (
								<List key={id}><Button onClick={(e) => onClick(e, price)}><List.Content>{price.facetdisplay} {icon}</List.Content></Button></List>
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
