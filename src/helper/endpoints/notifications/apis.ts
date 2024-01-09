import {
	createGET,
	createPOST,
	createPOSTWithParams,
} from "@helper/RequesterBase";
import {
	NotificationsListRespBody,
	NotificationsMarkReadParams,
	NotificationSettingsRespBody,
	NotificationSettingsReqBody,
} from "./schemas";

export const getNotifications = createGET<NotificationsListRespBody>(
	"/notifications/list",
	true,
);

export const markNotificationRead = createPOSTWithParams<
	unknown,
	unknown,
	NotificationsMarkReadParams
>("/notifications/mark-read/:id", true);

export const getNotificationSettings = createGET<NotificationSettingsRespBody>(
	"/notifications/settings",
	true,
);

export const updateNotificationSettings = createPOST<
	NotificationSettingsReqBody,
	unknown
>("/notifications/settings", true);
