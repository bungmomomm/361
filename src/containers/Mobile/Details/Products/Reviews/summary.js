import React, { Component } from 'react';
import { Rating, Comment, Svg } from '@/components/mobile';
import { Link } from 'react-router-dom';
import _ from 'lodash';

export default class ReviewSummary extends Component {

	constructor(props) {
		super(props);
		this.props = props;
	}

	shouldComponentUpdate(nextProps) {
		const { reviews, productId } = nextProps;
		return ((this.props.reviews.total !== reviews.total || this.props.reviews.summary !== reviews.summary) && !_.isUndefined(productId));
	}

	render() {
		const { reviews, seller, productId } = this.props;

		return (
			<div className='padding--small-h' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
				<div className='margin--medium-v'>
					<div className='padding--small-h margin--small-v margin--none-t flex-row flex-spaceBetween'>
						<div className='font-medium flex-row'>
							<strong>Ulasan Produk</strong>
							{(reviews.total === 0 && !_.isUndefined(productId)) && <span className='font-color--primary-ext-2 padding--small-h'>(Belum Tersedia)</span>}
						</div>
						{reviews.total > 2 && (
							<Link to={`/product/reviews/${productId}`} className='font-small flex-middle d-flex flex-row font-color--primary-ext-2' >
								<span style={{ marginRight: '5px' }} >LIHAT SEMUA</span> <Svg src='ico_chevron-right.svg' />
							</Link>
						)}
					</div>
					{reviews.total > 0 && (
						<div className='border-bottom'>
							<div className='padding--small-h margin--medium-v margin--none-t flex-row flex-middle'>
								<Rating
									active={(reviews.rating < 5) ? Number.parseFloat(reviews.rating).toFixed(1) : reviews.rating}
									total={5}
								/>
								<div className='flex-row padding--small-h'>
									<strong>{(reviews.rating < 5) ? Number.parseFloat(reviews.rating).toFixed(1) : reviews.rating} / 5</strong>
									<span className='font-color--primary-ext-2 padding--small-h'>{`(${reviews.total} Ulasan)`}</span>
								</div>
							</div>
						</div>
					)}
					{reviews.total > 0 && (
						<div>
							{status.loading && this.loadingContent}
							{!status.loading &&
								(reviews.summary.map((item, idx) => {
									return (
										<div key={`pdp-rvd-${idx + 1}`}>
											<Comment key={idx} type='review' data={item} />
											{!_.isEmpty(item.reply.reply) &&
												<div className='comment-reply' key={`pdp-rvd-${idx + 2}`} >
													<div><Svg src='ico_review_reply.svg' /></div>
													<Comment key={idx} type='review-reply' replyData={item.reply} sellerData={seller} />
												</div>
											}
										</div>
									);
								})
								)}</div>
					)}
				</div>
			</div>
		);
	}
}
