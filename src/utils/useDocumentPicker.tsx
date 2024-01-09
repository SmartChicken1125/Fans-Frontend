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
					data: result.files.map((asset, index) => ({
						id: `${new Date().getTime()}-${index}`,
						uri: asset,
						isPicker: true,
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
					data: result.files.map((asset, index) => ({
						id: `${new Date().getTime()}-${index}`,
						uri: asset,
						isPicker: true,
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
					data: result.files.map((asset, index) => ({
						id: `${new Date().getTime()}-${index}`,
						uri: asset,
						isPicker: true,
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
		useVideoPicker,
		useImagePicker,
	};
};

export default useDocumentPicker;
