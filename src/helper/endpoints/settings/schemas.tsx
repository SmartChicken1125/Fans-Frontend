import { GenderType, IPost, LanguageType } from "@helper/CommonAPISchemas";

export interface AnalyticsPostsRespBody {
	posts: IPost[];
	page: number;
	size: number;
	total: number;
}

export interface ChangePasswordReqBody {
	oldPassword: string;
	newPassword: string;
}

export interface UpdateSettingReqBody {
	username?: string;
	birthdate?: Date;
	country?: string;
	displayName?: string;
	gender?: GenderType;
	language?: LanguageType;
	isShowProfile?: boolean;
	phonenumber?: string;
}
export interface UpdateEmailReqBody {
	email: string;
}

export interface VerifyDeleteAccountReqBody {
	code: string;
}

export interface VerifyNewEmailReqBody {
	code: string;
	newEmail: string;
}

export interface VideoCallDurationReqBody {
	length: number;
	price: number;
	currency: string;
	isEnabled: boolean;
}

export interface VideoCallIntervalReqBody {
	startTime: string;
	length: number;
	day: number;
}
