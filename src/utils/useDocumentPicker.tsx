import { MediaType } from "@usertypes/commonEnums";
import { IPickerMedia } from "@usertypes/types";
import { MediaTypeOptions, openMediaPicker } from "./mediaPicker";

export interface IPickerResult {
	ok: boolean;
	data: IPickerMedia[];
	message?: string;
}

const useDocumentPicker = () => {
	async function useAudioPicker(multiple?: boolean): Promise<IPickerResult> {
		try {
			const result = await openMediaPicker({
				mediaTypes: MediaTypeOptions.Audio,
				allowsMultipleSelection: multiple,
			});

			if (!result.canceled) {
				return {
					ok: true,
					data: result.files.map((value, index) => ({
						id: `${new Date().getTime()}-${index}`,
						uri: value.url,
						isPicker: true,
						type: MediaType.Audio,
					})),
				};
			} else {
				return {
					ok: false,
					data: [],
					message: "Failed to read file.",
				};
			}
		} catch (error) {
			return {
				ok: false,
				data: [],
				message: error as string,
			};
		}
	}

	async function useVideoPicker(multiple?: boolean): Promise<IPickerResult> {
		try {
			const result = await openMediaPicker({
				mediaTypes: MediaTypeOptions.Videos,
				allowsMultipleSelection: multiple,
			});

			if (!result.canceled) {
				return {
					ok: true,
					data: result.files.map((value, index) => ({
						id: `${new Date().getTime()}-${index}`,
						uri: value.url,
						isPicker: true,
						type: MediaType.Video,
					})),
				};
			} else {
				return {
					ok: false,
					data: [],
					message: "Failed to read file.",
				};
			}
		} catch (error) {
			return {
				ok: false,
				data: [],
				message: error as string,
			};
		}
	}

	async function useImagePicker(multiple?: boolean): Promise<IPickerResult> {
		try {
			const result = await openMediaPicker({
				mediaTypes: MediaTypeOptions.Images,
				allowsMultipleSelection: multiple,
			});

			if (!result.canceled) {
				return {
					ok: true,
					data: result.files.map((value, index) => ({
						id: `${new Date().getTime()}-${index}`,
						uri: value.url,
						isPicker: true,
						type: MediaType.Image,
					})),
				};
			} else {
				return {
					ok: false,
					data: [],
					message: "Failed to read file.",
				};
			}
		} catch (error) {
			return {
				ok: false,
				data: [],
				message: error as string,
			};
		}
	}

	async function useMediaPicker(multiple?: boolean): Promise<IPickerResult> {
		try {
			const result = await openMediaPicker({
				mediaTypes: MediaTypeOptions.Media,
				allowsMultipleSelection: multiple,
			});

			if (!result.canceled) {
				return {
					ok: true,
					data: result.files.map((value, index) => ({
						id: `${new Date().getTime()}-${index}`,
						uri: value.url,
						isPicker: true,
						type: value.type.startsWith("image")
							? MediaType.Image
							: MediaType.Video,
					})),
				};
			} else {
				return {
					ok: false,
					data: [],
					message: "Failed to read file.",
				};
			}
		} catch (error) {
			return {
				ok: false,
				data: [],
				message: error as string,
			};
		}
	}

	return {
		useAudioPicker,
		useImagePicker,
		useMediaPicker,
		useVideoPicker,
	};
};

export default useDocumentPicker;
