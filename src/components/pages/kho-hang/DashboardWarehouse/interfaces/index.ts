export interface PropsDashboardWarehouse {
	isTotal?: boolean;
	setUuidCompany?: (uuid: string) => void;
	setUuidTypeProduct?: (uuid: number) => void;
	total?: {
		amountMT: number;
		amountBDMTDemo: number;
		amountBDMT: number;
		amountTotalBDMT: number;
		amountOutBDMT: number;
	};
	specTotal?: {
		specUu: {
			colorShow: string;
			name: string;
			status: number;
			qualityUu: {
				name: string;
				status: number;
				uuid: string;
			};
			uuid: string;
		};
		amountMT: number;
		amountBDMTDemo: number;
		amountBDMT: number;
		amountTotalBDMT: number;
	}[];
	productTotal?: {
		productTypeUu: {
			colorShow: string;
			code: string;
			name: string;
			status: number;
			type: number;
			uuid: string;
		};
		amountMT: number;
		amountBDMTDemo: number;
		amountBDMT: number;
		amountTotalBDMT: number;
	}[];
	qualityTotal?: {
		qualityUu: {
			colorShow: string;
			name: string;
			status: number;
			uuid: string;
		};
		amountMT: number;
		amountBDMTDemo: number;
		amountBDMT: number;
		amountTotalBDMT: number;
	}[];
	dataWarehouse?: {
		amountMT: number;
		amountBDMTDemo: number;
		amountBDMT: number;
		amountTotalBDMT: number;
		amountOutBDMT: number;
		code: string;
		name: string;
		status: number;
		uuid: string;
		specWeight: {
			specUu: {
				colorShow: string;
				name: string;
				status: number;
				qualityUu: {
					name: string;
					status: number;
					uuid: string;
				};
				uuid: string;
			};
			amountMT: number;
			amountBDMTDemo: number;
			amountBDMT: number;
			amountTotalBDMT: number;
		}[];
		productWeight: {
			productTypeUu: {
				colorShow: string;
				code: string;
				name: string;
				status: number;
				type: number;
				uuid: string;
			};
			amountMT: number;
			amountBDMTDemo: number;
			amountBDMT: number;
			amountTotalBDMT: number;
		}[];
		qualityWeight: {
			qualityUu: {
				colorShow: string;
				name: string;
				status: number;
				uuid: string;
			};
			amountMT: number;
			amountBDMTDemo: number;
			amountBDMT: number;
			amountTotalBDMT: number;
		}[];
	};
}
