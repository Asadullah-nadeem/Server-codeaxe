import { v4 as uuid } from 'uuid';

export const DashboardMenu = [
	{
		id: uuid(),
		title: 'Dashboard',
		icon: 'home',
		link: '/'
	},
	{
		id: uuid(),
		title: 'CMS MANAGEMENT',
		grouptitle: true
	},
	{
		id: uuid(),
		title: 'Navigation',
		icon: 'menu',
		link: '/cms/navigation'
	},
	{
		id: uuid(),
		title: 'Home Settings',
		icon: 'layout',
		link: '/cms/home'
	},
	{
		id: uuid(),
		title: 'Services',
		icon: 'briefcase',
		link: '/cms/services'
	},
	{
		id: uuid(),
		title: 'Portfolio',
		icon: 'image',
		link: '/cms/portfolio'
	},
	{
		id: uuid(),
		title: 'Footer',
		icon: 'corner-left-down',
		link: '/cms/footer'
	},
	{
		id: uuid(),
		title: 'PAGES & CONTENT',
		grouptitle: true
	},
	{
		id: uuid(),
		title: 'About Us',
		icon: 'info',
		link: '/cms/about'
	},
	{
		id: uuid(),
		title: 'Legal & Info',
		icon: 'file-text',
		children: [
			{ id: uuid(), title: 'Privacy Policy', link: '/cms/legal?tab=privacy' },
			{ id: uuid(), title: 'Terms of Service', link: '/cms/legal?tab=terms' },
			{ id: uuid(), title: 'Refund & Cancellation', link: '/cms/legal?tab=refund-cancellation' },
			{ id: uuid(), title: 'Refund Policy', link: '/cms/legal?tab=refund-policy' }
		]
	},
	{
		id: uuid(),
		title: 'Contact Submissions',
		icon: 'mail',
		link: '/cms/contact'
	},
	{
		id: uuid(),
		title: 'SEO & Rewrites',
		icon: 'link',
		link: '/cms/rewrites'
	},
	{
		id: uuid(),
		title: 'MEDIA',
		grouptitle: true
	},
	{
		id: uuid(),
		title: 'Media Manager',
		icon: 'folder',
		link: '/cms/media'
	},
	{
		id: uuid(),
		title: 'SYSTEM',
		grouptitle: true
	},
	{
		id: uuid(),
		title: 'Admin Accounts',
		icon: 'users',
		link: '/admin/users'
	},
	{
		id: uuid(),
		title: 'DMS Settings',
		icon: 'shield',
		link: '/admin/dms-settings'
	}
];

export default DashboardMenu;
