
import loadable from 'loadable-components';
import { isMobile } from '@/utils';

// const Page = loadable(() => import('@/containers/Page'));

/**
 * cannot using like this 
 * const type = isMobile() ? 'Mobile' : 'Desktop';
 * const Home = loadable(() => import(`@/containers/${type}/Home`));
 * since genereated js file will mix dekstop & mobile
 */

const defRoute = loadable(() => import('@/containers/NotFound'));

let Home = defRoute;
let Search = defRoute;
let Lovelist = defRoute;
let Hashtags = defRoute;
let HashtagsDetails = defRoute;

if (isMobile()) {
	/**
	 * Require main mobile styles
	 */
	import('@/styles/mobile');

	Home = loadable(() => import('@/containers/Mobile/Home'));
	
	// Service Discovery
	Search = loadable(() => import('@/containers/Mobile/Discovery/Search'));
	Lovelist = loadable(() => import('@/containers/Mobile/Discovery/Lovelist'));
	Hashtags = loadable(() => import('@/containers/Mobile/Discovery/Hashtags'));

	// Service Details
	HashtagsDetails = loadable(() => import('@/containers/Mobile/Details/HashtagsDetails'));
} else {
	/**
	 * Require main desktop styles
	 */
	import('@/styles');
	Home = loadable(() => import('@/containers/Desktop/Home'));
}

export default [

	{
		path: '/',
		component: Home,
		exact: true
	},
	{
		path: '/hashtags',
		component: Hashtags,
		exact: true
	},
	{
		path: '/hashtags/details',
		component: HashtagsDetails,
		exact: true
	}, 
	{
		path: '/search',
		component: Search,
		exact: true
	}, {
		path: '/lovelist',
		component: Lovelist,
		exact: true
	}

];