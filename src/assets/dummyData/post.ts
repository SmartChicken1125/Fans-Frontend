import { PostType, SubscriptionTypes } from "@usertypes/commonEnums";
import { IUserList, IPost, IPaymentMethod } from "@usertypes/types";
import { testStoryFeeds } from "./storyFeed";

export const usersData = [
	{
		id: 2,
		username: "jasonm",
		isCurrentUser: false,
		isSelected: false,
		avatar: "posts/user-1.png",
		note: "New video coming soon! Stay...",
	},
	{
		id: 3,
		username: "smith",
		isCurrentUser: false,
		isSelected: false,
		avatar: "posts/user-1.png",
		note: "Filming new content ❤️",
	},
	{
		id: 4,
		username: "John",
		isCurrentUser: false,
		isSelected: false,
		avatar: "posts/user-1.png",
		note: "In NY for ths weekend! Text me for...",
	},
	{
		id: 5,
		username: "Kein",
		isCurrentUser: false,
		isSelected: false,
		avatar: "posts/user-1.png",
	},
];

export const postsData: IPost[] = [
	{
		id: "119569554403528704",
		profileId: "81230809917599744",
		profile: testStoryFeeds[0],
		title: "",
		type: PostType.Photo,
		caption: "aaa",
		thumb: {
			id: "119569537614692352",
			type: "Image",
			url: "media/AEA7XtzLqAFiRkuxzSOibvSLmFdYrHBYMShfP9n09Oc",
		},
		medias: [
			{
				id: "119569537614692352",
				type: "Image",
				url: "media/AEA7XtzLqAFiRkuxzSOibvSLmFdYrHBYMShfP9n09Oc",
			},
		],
		advanced: {
			isHideLikeViewCount: false,
			isTurnOffComment: false,
			isPaidLabelDisclaimer: false,
		},
		isArchived: false,
		isHidden: false,
		commentCount: 0,
		likeCount: 1,
		bookmarkCount: 0,
		createdAt: "2023-11-26T22:46:43.264Z",
		updatedAt: "2023-11-28T03:25:31.995Z",
		isPaidPost: false,
		isPinned: true,
		isBookmarked: false,
		isLiked: true,
		isPaidOut: false,
		isSelf: true,
		taggedPeoples: [],
		isExclusive: false,
		isPosted: true,
	},
	// {
	// 	id: "2",
	// 	username: "Jane Love",
	// 	time: "17h",
	// 	caption: "",
	// 	likeCount: 16,
	// 	isLike: false,
	// 	commentCount: 123,
	// 	bookmarkCount: 102,
	// 	isBookmark: false,
	// 	type: PostType.Audio,
	// 	resource: [
	// 		"https://images.unsplash.com/photo-1612144431180-2d672779556c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80",
	// 	],
	// 	audio: {
	// 		url: "",
	// 		title: "Summer Paradise",
	// 		description: "Jane Love (ft. Johana Rivers)",
	// 	},
	// },
];

export const tagsData = [
	{
		id: 1,
		title: "#music",
		count: 15,
	},
	{
		id: 2,
		title: "#musicstudio",
		count: 15,
	},
	{
		id: 3,
		title: "#musiclife",
		count: 15,
	},
	{
		id: 4,
		title: "#artist",
		count: 15,
	},
	{
		id: 5,
		title: "#artinfluencer",
		count: 15,
	},
];

export const recentSearchesData = [
	{
		id: 1,
		title: "content creator",
		searches: [
			{
				id: 1,
				fullname: "Jonathan Streem",
				username: "@jonathans",
				avatar: "/post_page/user-2.png",
			},
			{
				id: 2,
				fullname: "Jane Love",
				username: "@janelove",
				avatar: "/post_page/user-2.png",
			},
		],
	},
	{
		id: 2,
		title: "yoga influencer",
		searches: [
			{
				id: 1,
				fullname: "Ramiro Altamiglia",
				username: "@ramaa",
				avatar: "/post_page/user-2.png",
			},
			{
				id: 2,
				fullname: "Ann Liu",
				username: "@littleannnn",
				avatar: "/post_page/user-2.png",
			},
			{
				id: 3,
				fullname: "José Esperanza",
				username: "@josemodel",
				avatar: "/post_page/user-2.png",
			},
		],
	},
];

export const usersListData: IUserList[] = [
	{
		id: "1",
		title: "Friends",
		isActive: true,
		userId: "",
		updatedAt: "",
		creators: [
			{
				id: "0",
				userId: "0",
				displayName: "",
				migrationLink: "",
				profileLink: "",
				flags: 0,
				bio: "",
				cover: [],
				previews: [],
				isNSFW: null,
				subscriptionType: SubscriptionTypes.Flat,
				disabled: false,
				location: "",
				imageCount: 0,
				videoCount: 0,
				subscriptionCount: 0,
				commentCount: 0,
				likeCount: 0,
				socialLinks: [],
				subscriptions: [],
				tiers: [],
				roles: [],
				categories: [],
				stories: [],
				isDisplayShop: false,
				review: {
					score: 0,
					total: 0,
				},
			},
		],
		enabled: true,
	},
];

export const messageListData = [
	{
		id: 1,
		listName: "Unread",
		active: true,
		unread: 17,
		users: [
			{
				id: 1,
				fullname: "Jane Love",
				username: "@janelove",
				avatar: "",
				active: false,
			},
			{
				id: 2,
				fullname: "Kate Lee",
				username: "@katelee1",
				avatar: "",
				active: false,
			},
			{
				id: 3,
				fullname: "Kate Lee 2",
				username: "@katelee12",
				avatar: "",
				active: false,
			},
			{
				id: 4,
				fullname: "Kate Lee 3",
				username: "@katelee13",
				avatar: "",
				active: false,
			},
			{
				id: 5,
				fullname: "Kate Lee 4",
				username: "@katelee14",
				avatar: "",
				active: false,
			},
			{
				id: 6,
				fullname: "Kate Lee 5",
				username: "@katelee15",
				avatar: "",
				active: false,
			},
		],
	},
	{
		id: 2,
		listName: "Priority",
		active: true,
		users: [
			{
				id: 1,
				fullname: "Jane Love",
				username: "@janelove",
				avatar: "",
				active: false,
			},
			{
				id: 2,
				fullname: "Kate Lee",
				username: "@katelee1",
				avatar: "",
				active: false,
			},
			{
				id: 3,
				fullname: "Kate Lee 2",
				username: "@katelee12",
				avatar: "",
				active: false,
			},
			{
				id: 4,
				fullname: "Kate Lee 3",
				username: "@katelee13",
				avatar: "",
				active: false,
			},
			{
				id: 5,
				fullname: "Kate Lee 4",
				username: "@katelee14",
				avatar: "",
				active: false,
			},
			{
				id: 6,
				fullname: "Kate Lee 5",
				username: "@katelee15",
				avatar: "",
				active: false,
			},
		],
	},
];

export const paymentMethodsData: IPaymentMethod[] = [
	{
		id: "1",
		customerPaymentProfileId: "1",
		cardNumber: "VISA **** **** **** 1234",
		expirationDate: "",
		cardType: "Visa",
	},
	{
		id: "2",
		customerPaymentProfileId: "2",
		cardNumber: "VISA **** **** **** 4567",
		expirationDate: "",
		cardType: "Visa",
	},
	{
		id: "3",
		customerPaymentProfileId: "3",
		cardNumber: "VISA **** **** **** 6789",
		expirationDate: "",
		cardType: "Visa",
	},
];
