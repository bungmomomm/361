
import loadable from 'loadable-components';
import { isMobile } from '@/utils';

// const Page = loadable(() => import('@/containers/Page'));

/**
 * cannot using like this 
 * const type = isMobile() ? 'Mobile' : 'Desktop';
 * const Home = loadable(() => import(`@/containers/${type}/Home`));
 * since genereated js file will mix dekstop & mobile
 */

const Home = isMobile() ? loadable(() => import('@/containers/Mobile/Home'))
	: loadable(() => import('@/containers/Desktop/Home'));
const Lovelist = isMobile() ? loadable(() => import('@/containers/Mobile/Discovery/Lovelist'))
	: loadable(() => import('@/containers/Mobile/Home'));
const Hashtags = isMobile() ? loadable(() => import('@/containers/Mobile/Discovery/Hashtags'))
	: loadable(() => import('@/containers/Mobile/Home'));
const HashtagsDetails = isMobile() ? loadable(() => import('@/containers/Mobile/Details/HashtagsDetails'))
	: loadable(() => import('@/containers/Mobile/Home'));

export default [

	{
		path: '/',
		component: Home,
		exact: true
	},
	{
		path: '/lovelist',
		component: Lovelist
	},
	{
		path: '/hashtags',
		component: Hashtags
	},
	{
		path: '/hashtags/details',
		component: HashtagsDetails
	},
];