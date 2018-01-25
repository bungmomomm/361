
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
let SearchNotFound = defRoute;
let Category = defRoute;
let SubCategory = defRoute;
let BrandCategory = defRoute;
let CatalogCategory = defRoute;
let Lovelist = defRoute;
let Hashtags = defRoute;
let HashtagsDetails = defRoute;
let UserLogin = defRoute;
let NewArrival = defRoute;

if (isMobile()) {
	/**
	 * Require main mobile styles
	 */
	import('@/styles/mobile');

	Home = loadable(() => import('@/containers/Mobile/Home'));

	// Service Discovery
	Search = loadable(() => import('@/containers/Mobile/Discovery/Search'));
	SearchNotFound = loadable(() => import('@/containers/Mobile/Discovery/SearchNotFound'));
	Lovelist = loadable(() => import('@/containers/Mobile/Discovery/Lovelist'));
	Hashtags = loadable(() => import('@/containers/Mobile/Discovery/Hashtags'));
	Category = loadable(() => import('@/containers/Mobile/Discovery/Category'));
	SubCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/SubCategory'));
	BrandCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/BrandCategory'));
	CatalogCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/Catalog'));
	NewArrival = loadable(() => import('@/containers/Mobile/Discovery/NewArrival'));

	// Service Details
	HashtagsDetails = loadable(() => import('@/containers/Mobile/Details/HashtagsDetails'));

	// Users
	UserLogin = loadable(() => import('@/containers/Mobile/Users/Login'));
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
		component: Hashtags
	},
	{
		path: '/hashtags/details',
		component: HashtagsDetails
	},
	{
		path: '/search',
		component: Search
	},
	{
		path: '/searchnotfound', // This path only for displaying search not found SearchNotFound Container
		component: SearchNotFound
	},
	{
		path: '/category',
		component: Category,
	}, {
		path: '/subcategory',
		component: SubCategory
	}, {
		path: '/brandcategory',
		component: BrandCategory
	}, {
		path: '/catalogcategory',
		component: CatalogCategory
	}, {
		path: '/lovelist',
		component: Lovelist,
		exact: true
	},
	{
		path: '/login',
		component: UserLogin,
		exact: true
	},
	{
		path: '/newarrival',
		component: NewArrival,
		exact: true
	}
];