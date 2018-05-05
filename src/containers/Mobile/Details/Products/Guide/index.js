import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import Shared from '@/containers/Mobile/Shared';
import {
	Page,
	Header,
	Svg,
	Image,
	Table,
	Button } from '@/components/mobile';
import _ from 'lodash';
import queryString from 'query-string';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Guide extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.data = null;
		this.goBack = this.goBack.bind(this);
	}

	componentWillMount() {
		this.isSizeGuideExist();
	}

	isSizeGuideExist() {
		const { detail } = this.props.product;
		if (!_.isEmpty(detail)) {
			this.data = detail.spec.filter((item) => {
				const specKey = item.key.toLowerCase().trim();
				if (specKey.indexOf('size') === -1 && specKey.indexOf('guide') === -1) {
					return false;
				}

				if (!_.isEmpty(item) && _.has(item, 'value')) {
					return true;
				}
				return false;
			});
		} else this.goBack();
	}

	goBack() {
		const { history } = this.props;
		if ((history.length - 1 >= 0)) {
			history.goBack();
		} else {
			history.push('/');
		}
	}

	render() {
		const HeaderOption = {
			left: (
				<Button onClick={this.goBack} >
					<Svg src={'ico_arrow-back-left.svg'} />
				</Button>
			),
			center: 'Panduan Ukuran',
			right: null
		};
		
		let showProductSizeGuideDetail = false;
		
		const { product } = this.props;
		
		const query = queryString.parse(this.props.location.search);
		
		if (query.referrer === 'mds') {
			showProductSizeGuideDetail = true;
		}
		
		return (
			<div>
				<Page color='white' style={{ overflow: 'auto' }}>
					<div className='margin--medium-v padding--medium-h'>
						<Table>
							<thead>
								<tr>
									<th>International</th>
									<th>Bust(cm)</th>
									<th>Waist(cm)</th>
									<th>Hip(cm)</th>
								</tr>
							</thead>
							<tbody>
								<tr><td>XS</td><td>86-92</td><td>69-74</td><td>88-93</td></tr>
								<tr><td>S</td><td>92-97</td><td>74-79</td><td>93-98</td></tr>
								<tr><td>M</td><td>97-102</td><td>79-84</td><td>98-103</td></tr>
								<tr><td>L</td><td>102-107</td><td>84-89</td><td>103-111</td></tr>
								<tr><td>XL</td><td>107-112</td><td>89-94</td><td>111-116</td></tr>
							</tbody>
						</Table>
						{ product.detail && this.data && showProductSizeGuideDetail === true && (
							<div dangerouslySetInnerHTML={{ __html: this.data[0].value }} />
						)}
						{/* {!(/^/.test(spec)) && spec } */}
					</div>
					<div className='margin--medium-v padding--medium-h'>
						<Image local src='temp/size-guide.jpg' />
					</div>
				</Page>
				<Header.Modal {...HeaderOption} />
			</div>
		);
	}

};

const mapStateToProps = (state) => {
	return {
		product: state.product,
		shared: state.shared,
	};
};

export default withCookies(connect(mapStateToProps)(Shared(Guide)));
