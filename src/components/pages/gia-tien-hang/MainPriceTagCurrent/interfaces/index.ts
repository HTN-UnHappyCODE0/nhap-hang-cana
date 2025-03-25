export interface PropsMainPriceTagCurrent {}

export interface IPriceTag {
	state: number;
	status: number;
	transportType: number;
	specUu: {
		name: string;
		status: number;
		uuid: string;
	};
	customerUu: {
		code: string;
		name: string;
		uuid: string;
		companyUu: {
			code: string;
			name: string;
			uuid: string;
		};
	};
	partnerUu: {
		code: string;
		name: string;
		uuid: string;
	};
	pricetagUu: {
		code: string;
		amount: number;
		status: number;
		uuid: string;
	};
	qualityUu: {
		name: string;
		status: number;
		uuid: string;
	};
	productTypeUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	uuid: string;
	created: string;
	accountUu: {username: string; status: number; uuid: string};
}
