import React, {
	PureComponent
} from 'react';
import Button from '../Button';
import Svg from '../Svg';
class Love extends PureComponent {
	loveClicked(e) {
		const { onClick } = this.props;
		onClick(e);
	}
	render() {
		const { disabled, loading, showNumber, status, text, total } = this.props;
		const icon = status === 1 ? 'ico_love-filled.svg' : 'ico_love.svg';
		return (
			<Button onClick={(e) => this.loveClicked()} disabled={disabled} loading={loading}>
				<Svg src={icon} />
				{showNumber && (
					<span>{total} {text}</span>
				)}
			</Button>
		);
	}
}

Love.defaultProps = {
	text: 'Suka',
	total: 0
};

export default Love;