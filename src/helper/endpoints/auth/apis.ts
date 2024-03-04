import {
	createDELETEWithParams,
	createGET,
	createPOST,
	createPOSTWithParams,
} from "@helper/RequesterBase";
import {
	AuthCheckResetPasswordReqBody,
	AuthForgotPasswordReqBody,
	AuthOAuth2AuthorizeReqBody,
	AuthOAuth2AuthorizeReqParams,
	AuthOAuth2LinkListRespBody,
	AuthOAuth2LinkReqBody,
	AuthOAuth2LinkReqParams,
	AuthOAuth2LinkRespBody,
	AuthPasswordLoginReqBody,
	AuthPasswordRegisterReqBody,
	AuthResendReqBody,
	AuthResetPasswordReqBody,
	AuthUserInfoRespBody,
	AuthVerifyCodeReqBody,
	TokenRespBody,
} from "./schemas";

export const authLogin = createPOST<AuthPasswordLoginReqBody, TokenRespBody>(
	"/auth/login",
);

export const authRegister = createPOST<
	AuthPasswordRegisterReqBody,
	TokenRespBody
>("/auth/register");

export const authLogout = createPOST<null, null>("/auth/logout", true);

export const authUserInfo = createGET<AuthUserInfoRespBody>(
	"/auth/user-info",
	true,
);

export const authForgotPassword = createPOST<AuthForgotPasswordReqBody, never>(
	"/auth/forgot-password",
);

export const authResetPassword = createPOST<
	AuthResetPasswordReqBody,
	TokenRespBody
>("/auth/reset-password");

export const authCheckResetPassword = createPOST<
	AuthCheckResetPasswordReqBody,
	never
>("/auth/check-reset-password");

export const authVerifyAccount = createPOST<AuthVerifyCodeReqBody, never>(
	"/auth/verify-account",
	true,
);

export const authResendVerifyCode = createPOST<AuthResendReqBody, never>(
	"/auth/resend-verify-code",
	true,
);

export const authOAuth2Authorize = createPOSTWithParams<
	AuthOAuth2AuthorizeReqBody,
	TokenRespBody,
	AuthOAuth2AuthorizeReqParams
>("/auth/oauth2/authorize/:provider");

export const authOAuth2Link = createPOSTWithParams<
	AuthOAuth2LinkReqBody,
	AuthOAuth2LinkRespBody,
	AuthOAuth2LinkReqParams
>("/auth/oauth2/link/:provider", true);

export const authOAuth2Unlink = createDELETEWithParams<
	undefined,
	never,
	AuthOAuth2LinkReqParams
>("/auth/oauth2/link/:provider", true);

export const authOAuth2LinkList = createGET<AuthOAuth2LinkListRespBody>(
	"/auth/oauth2/link-list",
	true,
);
