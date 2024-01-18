import { ISignUpForm } from "@usertypes/commonTypes";
import { ISocialLink } from "@usertypes/types";

export const validateEmail = (strEmail: string): string => {
	if (!strEmail) return "Please input email.";
	const validRegex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	if (strEmail.match(validRegex)) return "";
	else return "Please input valid email.";
};

export const validatePassword = (strPassword: string): string => {
	if (!strPassword) return "Please input password.";
	// min 8 letter, at least a symbol, upper and lower case letters and number
	// let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
	if (strPassword.length < 8)
		return "Password must be at least 8 characters long.";
	else return "";
};

const usernameRegex = /^[a-zA-Z0-9_.-]{3,32}$/;
export function validateUsername(username: string): string {
	return usernameRegex.test(username.trim())
		? ""
		: "Username can be 3~32 characters includes upper and lower case letters, number, hyphen, single dot and underscore symbole ";
}

export const validateResetPassword = (formData: {
	password: string;
	confirmPassword: string;
}): { password: string; confirmPassword: string } => {
	const formValidate = { password: "", confirmPassword: "" };

	if (!formData.password) formValidate.password = "Password is required.";
	else if (formData.password.length < 8)
		formValidate.password = "Password must be at least 8 characters long.";

	if (formData.password !== formData.confirmPassword)
		formValidate.confirmPassword = "Password didn't match";
	return formValidate;
};

export const validateSignUpForm = (formData: ISignUpForm): ISignUpForm => {
	return {
		username: validateUsername(formData.username),
		email: validateEmail(formData.email),
		password:
			formData.password.length > 0
				? validatePassword(formData.password)
				: "Please input password.",
	};
};

const referralCodeRegex = /^[a-zA-Z0-9]{1,20}$/;
export function validateReferralCode(code: string): boolean {
	return referralCodeRegex.test(code.trim());
}

const websiteRegex = /^\s*(?:(?:http|https):\/\/)?(?:www.)?(\w+)/i;
const instagramRegex =
	/^\s*(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/i;
const amazonRegex =
	/^\s*https?:\/\/(?=(?:....)?amazon|smile)(www|smile)\S+com(((?:\/(?:dp|gp)\/([A-Z0-9]+))?\S*[?&]?(?:tag=))?\S*?)(?:#)?(\w*?-\w{2})?(\S*)(#?\S*)+/i;
// const twitterRegex =
// 	/^\s*(?:(?:http|https):\/\/)?(?:www.)?twitter\.com\/([a-zA-Z0-9_]+)/i;
const twitterRegex =
	/^\s*(?:(?:http|https):\/\/)?(?:www.)?(twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i;
const tiktokRegex =
	/^\s*(?:(?:http|https):\/\/)?(?:m|www|vm)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=|\?item_id=)(\d+))|\w+)/i;
const snapchatRegex =
	/^\s*(?:(?:http|https):\/\/)?(?:www.)?snapchat\.com\/([a-zA-Z0-9_]+)/i;
const youtubeRegex =
	/^\s*(?:(?:http|https):\/\/)?(?:www.)?(youtube\.com|youtu\.be)\/([a-zA-Z0-9_]+)/i;
const facebookRegex =
	/^\s*(?:(?:http|https):\/\/)?(?:www.)?(facebook.com)\/([a-zA-Z0-9_]+)/i;
const redditRegex =
	/^\s*(?:(?:http|https):\/\/)?(?:www.)?(reddit.com)\/([a-zA-Z0-9_]+)/i;
const discordRegex =
	/^\s*(?:(?:http|https):\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/i;
const twitchRegex =
	/^\s*(?:(?:http|https):\/\/)?(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/i;

export const validateSocialLink = (
	link: ISocialLink,
): { isValid: boolean; message: string } => {
	let message = "";
	let isValid = true;
	switch (link.provider) {
		case "website":
			isValid = link.url === "" || websiteRegex.test(link.url);
			message = isValid ? "" : "Must have website link.";
			break;
		case "amazon":
			isValid = link.url === "" || amazonRegex.test(link.url);
			message = isValid ? "" : "Must have smile.amazon.com/";
			break;
		case "instagram":
			isValid = link.url === "" || instagramRegex.test(link.url);
			message = isValid ? "" : "Must have instagram.com/";
			break;
		case "twitter":
			isValid = link.url === "" || twitterRegex.test(link.url);
			message = isValid ? "" : "Must have twitter.com/ or x.com/";
			break;
		case "tiktok":
			isValid = link.url === "" || tiktokRegex.test(link.url);
			message = isValid ? "" : "Must have tiktok.com/";
			break;
		case "snapchat":
			isValid = link.url === "" || snapchatRegex.test(link.url);
			message = isValid ? "" : "Must have snapchat.com/";
			break;
		case "youtube":
			isValid = link.url === "" || youtubeRegex.test(link.url);
			message = isValid ? "" : "Must have youtube.com/ or youtu.be/";
			break;
		case "facebook":
			isValid = link.url === "" || facebookRegex.test(link.url);
			message = isValid ? "" : "Must have facebook.com/";
			break;
		case "reddit":
			isValid = link.url === "" || redditRegex.test(link.url);
			message = isValid ? "" : "Must have reddit.com/";
			break;
		case "discord":
			isValid = link.url === "" || discordRegex.test(link.url);
			message = isValid
				? ""
				: "Must have discord.gg/ or discordapp.com/invite/";
			break;
		case "twitch":
			isValid = link.url === "" || twitchRegex.test(link.url);
			message = isValid ? "" : "Must have twitch.com/ or twitch.tv/";
			break;
		default:
			message = "";
			break;
	}
	return {
		isValid: isValid,
		message: message,
	};
};
