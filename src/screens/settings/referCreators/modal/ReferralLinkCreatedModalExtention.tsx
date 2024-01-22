import Share, { Social } from "react-native-share";

const ReferralLinkCreatedModalExtension = (link: string) => {
	try {
		Share.shareSingle({
			message: encodeURIComponent(link),
			social: Social.Instagram,
			type: "text/plain",
		});
	} catch (error) {
		console.log("Error =>", error);
	}
};

export default ReferralLinkCreatedModalExtension;
