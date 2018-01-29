
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

let Page404 = defRoute;
let Home = defRoute;
let Search = defRoute;
let SearchNotFound = defRoute;
let Category = defRoute;
let SubCategory = defRoute;
let CatalogCategory = defRoute;
let Lovelist = defRoute;
let Hashtags = defRoute;
let HashtagsDetails = defRoute;
let UserLogin = defRoute;
let FilterCategory = defRoute;

if (isMobile()) {
	/**
	 * Require main mobile styles
	 */
	import('@/styles/mobile');

	Home = loadable(() => import('@/containers/Mobile/Home'));

	// Service Discovery
	Page404 = loadable(() => import('@/containers/Mobile/404'));
	Search = loadable(() => import('@/containers/Mobile/Discovery/Search'));
	SearchNotFound = loadable(() => import('@/containers/Mobile/Discovery/SearchNotFound'));
	Lovelist = loadable(() => import('@/containers/Mobile/Discovery/Lovelist'));
	Hashtags = loadable(() => import('@/containers/Mobile/Discovery/Hashtags'));
	Category = loadable(() => import('@/containers/Mobile/Discovery/Category'));
	SubCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/SubCategory'));
	CatalogCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/Catalog'));
	FilterCategory = loadable(() => import('@/containers/Mobile/Discovery/Category/Catalog/filter'));

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
	},
	{
		path: '/catalogcategory',
		component: CatalogCategory
	}, {
		path: '/filterCategory',
		component: FilterCategory
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
		path: '/*', // Page not found handling.
		component: Page404,
		exact: true
	}
];
