import React from 'react';
import { Link } from 'react-router-dom';
import { Page, Header, Image, Svg, Table } from '@/components/mobile';

const Comments = () => {
	const HeaderOption = {
		left: (
			<Link to='/'>
				<Svg src={'ico_arrow-back-left.svg'} />
			</Link>
		),
		center: 'Panduan Ukuran',
		right: null
	};
	return (
		<div>
			<Page>
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
				</div>
				<div className='margin--medium-v padding--medium-h'>
					<Image local src='temp/size-guide.jpg' />
				</div>
			</Page>
			<Header.Modal {...HeaderOption} />
		</div>);
};

export default Comments;
