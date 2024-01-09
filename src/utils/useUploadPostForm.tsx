import { API_URL } from "@env";
import {
	finishUpload,
	generatePresignedUrl,
} from "@helper/endpoints/media/apis";
import {
	MediaType,
	StorageKeyTypes,
	UploadUsageType,
} from "@usertypes/commonEnums";
import { IUploadForm } from "@usertypes/types";
import { getStorage } from "@utils/storage";
import db from "mime-db";
import { Platform } from "react-native";
import { getBlob } from "./common";

export default function useUploadPostForm() {
	const apiUrl = `${API_URL}/posts/upload-form`;

	const uploadPostForm = async (
		fileUris: string[],
		usage: UploadUsageType = UploadUsageType.POST,
	) => {
		if (fileUris.length === 0) {
			return null;
		}

		let token = await getStorage(StorageKeyTypes.AccessToken);
		token = token?.replaceAll('"', "") ?? "";

		if (["ios", "android"].includes(Platform.OS)) {
			try {
				const paths: IUploadForm[] = [];
				for await (const uri of fileUris) {
					const ext = uri.split("/").pop()?.split(".").pop() ?? "";
					const resp = await generatePresignedUrl(
						{ usage },
						{ type: MediaType.Form },
					);
					if (resp.ok) {
						const { id, url, origin, presignedUrl } = resp.data;
						const fileBody = await getBlob(uri);
						const response = await fetch(presignedUrl, {
							method: "PUT",
							body: fileBody,
						});
						if (response.status !== 200) {
							await finishUpload({ isSuccess: false }, { id });
						} else {
							paths.push({ id, url, origin: origin ?? "" });
						}
					} else {
						throw new Error("Failed to generate presigned url.");
					}
				}
				return {
					ok: true,
					data: paths,
				};
			} catch (error) {
				return { ok: false, data: [] };
			}
		} else if (Platform.OS === "web") {
			try {
				const paths: IUploadForm[] = [];
				const formData = new FormData();
				for await (const uri of fileUris) {
					const base64Content = uri.split(",")[0];
					const mimeType = base64Content.match(
						/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/,
					);
					const type = mimeType ? db[mimeType[0]] : undefined;
					const ext = type?.extensions ? type?.extensions[0] : "";
					const resp = await generatePresignedUrl(
						{ usage },
						{ type: MediaType.Form },
					);
					if (resp.ok) {
						const { id, url, origin, presignedUrl } = resp.data;
						const fileName = `form.${ext}`;
						const file = await fetch(uri)
							.then((res) => res.blob())
							.then(
								(blob) =>
									new File([blob], fileName, {
										type: mimeType
											? mimeType[0]
											: undefined,
									}),
							);
						const response = await fetch(presignedUrl, {
							method: "PUT",
							body: file,
						});
						if (response.status !== 200) {
							await finishUpload(
								{ isSuccess: false },
								{ id: id },
							);
						} else {
							paths.push({ id, url, origin: origin ?? "" });
						}
					} else {
						throw new Error("Failed to generate presigned url.");
					}
				}
				return {
					ok: true,
					data: paths,
				};
			} catch {
				return { ok: false, data: [] };
			}
		}
	};

	return [uploadPostForm] as const;
}
