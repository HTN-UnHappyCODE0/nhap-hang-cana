export interface PropsMainHistoryChangePriceTag {}

export interface IPriceTagChangeHistory {
	customerSpecUu: {
		customerUu: {
			partnerUu: {
				code: string;
				name: string;
				status: number;
				type: number;
				uuid: string;
			};
			companyUu: {
				code: string;
				name: string;
				status: number;
				uuid: string;
			};
			code: string;
			name: string;
			status: number;
			typeCus: number;
			uuid: string;
		};
		state: number;
		status: number;
		transportType: number;
		specUu: {
			name: string;
			status: number;
			qualityUu: null;
			uuid: string;
		};
		pricetagUu: {
			code: string;
			amount: number;
			status: number;
			uuid: string;
		};
		qualityUu: null;
		productTypeUu: {
			code: string;
			name: string;
			status: number;
			type: number;
			uuid: string;
		};
		accountUu: null;
		storageUu: null;
		uuid: string;
	};
	pricetagUu: {
		code: string;
		amount: number;
		status: number;
		uuid: string;
	};
	uuid: string;
}
