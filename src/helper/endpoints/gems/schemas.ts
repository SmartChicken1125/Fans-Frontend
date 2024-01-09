// This file is supposed to be synced between app and backend
// frontend: helper/endpoints/gems/schemas.ts
// backend: web/routes/gems/schemas.ts

export interface PriceReqBody {
	gems: number;
	service: string;
	customerInformation: {
		country: string;
		state: string;
		address: string;
		city: string;
		zip: string;
	};
}

export interface TipReqBody {
	creatorId: string;
	gems: number;
	message?: string;
}

export interface StripeGemPurchaseReqBody {
	gems: number;
	customerInformation: {
		country: string;
		state: string;
		address: string;
		city: string;
		zip: string;
	};
}

export interface PayPalGemPurchaseReqBody {
	gems: number;
	customerInformation: {
		country: string;
		state: string;
		address: string;
		city: string;
		zip: string;
	};
}

export interface AuthorizeNetGemPurchaseReqBody {
	gems: number;
	opaqueDataValue: string;
	customerInformation: {
		firstName: string;
		lastName: string;
		country: string;
		state: string;
		address: string;
		city: string;
		zip: string;
	};
}

export interface PayPalPurchaseRespBody {
	approvalLink: string;
}

export interface StripePurchaseRespBody {
	clientSecret: string;
}
