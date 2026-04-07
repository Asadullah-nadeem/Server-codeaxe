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
		link: '/cms/navigation',
		permKey: 'navigation'
	},
	{
		id: uuid(),
		title: 'Email Templates',
		icon: 'mail',
		link: '/cms/emails',
		permKey: 'emails'
	},
	{
		id: uuid(),
		title: 'SMTP Settings',
		icon: 'settings',
		link: '/cms/smtp',
		permKey: 'smtp'
	},
	{
		id: uuid(),
		title: 'Home Settings',
		icon: 'layout',
		link: '/cms/home',
		permKey: 'home'
	},
	{
		id: uuid(),
		title: 'Section Visibility',
		icon: 'toggle-left',
		link: '/cms/sections',
		permKey: 'sections'
	},
	{
		id: uuid(),
		title: 'Services',
		icon: 'briefcase',
		link: '/cms/services',
		permKey: 'services'
	},
	{
		id: uuid(),
		title: 'Portfolio',
		icon: 'image',
		link: '/cms/portfolio',
		permKey: 'portfolio'
	},
	{
		id: uuid(),
		title: 'Work',
		icon: 'layers',
		link: '/cms/work',
		permKey: 'portfolio'
	},
	{
		id: uuid(),
		title: 'Footer',
		icon: 'corner-left-down',
		link: '/cms/footer',
		permKey: 'footer'
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
		link: '/cms/about',
		permKey: 'about'
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
		],
		permKey: 'legal'
	},
	{
		id: uuid(),
		title: 'Contact Submissions',
		icon: 'mail',
		link: '/cms/contact',
		permKey: 'contact'
	},
	{
		id: uuid(),
		title: 'SEO & Rewrites',
		icon: 'link',
		link: '/cms/rewrites',
		permKey: 'rewrites'
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
		link: '/cms/media',
		permKey: 'media'
	},
	{
		id: uuid(),
		title: 'SYSTEM',
		grouptitle: true
	},
	{
		id: uuid(),
		title: 'Super Admin Panel',
		icon: 'shield',
		badge: 'SA',
		badgecolor: 'danger',
		link: '/admin/superadmin',
		permKey: 'superadmin'
	},
	{
		id: uuid(),
		title: 'System Activity',
		icon: 'activity',
		link: '/cms/activity',
		permKey: 'superadmin'
	},
	{
		id: uuid(),
		title: 'Admin Accounts',
		icon: 'users',
		link: '/admin/users',
		permKey: 'admin_accounts'
	},
	{
		id: uuid(),
		title: 'CLIENT INTERACTION',
		grouptitle: true
	},
	{
		id: uuid(),
		title: 'Client Messaging',
		icon: 'message-square',
		link: '/admin/active-chats',
		permKey: 'chat'
	},
	{
		id: uuid(),
		title: 'Registered End-Users',
		icon: 'users',
		link: '/admin/registered-users',
		permKey: 'registered_users'
	},
	{
		id: uuid(),
		title: 'DMS Settings',
		icon: 'database',
		link: '/admin/dms-settings',
		permKey: 'dms'
	},
	{
		id: uuid(),
		title: 'System Connections',
		icon: 'cpu',
		link: '/cms/connections',
		permKey: 'dms'
	}
];

export default DashboardMenu;
