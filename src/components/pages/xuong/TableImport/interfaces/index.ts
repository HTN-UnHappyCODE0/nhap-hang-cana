export interface PropsTableImport {
	uuid: string | null;
}

export interface ITableBillImportCustomer {
	numShip: string;
	drynessAvg: number;
	scalesStationUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	lstTruck: {
		code: string;
		licensePalate: string;
		status: number;
		uuid: number;
	}[];
	typePrint: number;
	isSift: number;
	timeStart: string;
	timeEnd: string;
	updatedTime: string;
	created: string;
	documentId: string;
	accountUu: {
		username: string;
		status: number;
		uuid: string;
	};
	accountUpdateUu: {
		username: string;
		status: number;
		uuid: string;
	};
	description: string;
	qualityUu: {
		name: string;
		status: number;
		uuid: string;
	};
	weightTotal: number;
	customerName: string;
	scalesType: number;
	transportType: number;
	specificationsUu: {
		name: string;
		status: number;
		uuid: string;
		qualityUu: {
			name: string;
			status: number;
			uuid: string;
		};
	};
	batchsUu: {
		uuid: string;
		ship: string;
		isShip: number;
		weightIntent: number;
		timeIntend: string;
		shipUu: {
			code: string;
			licensePalate: string;
			status: number;
			uuid: string;
		};
		shipOutUu: {
			code: string;
			licensePalate: string;
			status: number;
			uuid: string;
		};
	};
	productTypeUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
		type: number;
	};
	pricetagUu: {
		code: string;
		amount: number;
		status: number;
		uuid: string;
	};
	isBatch: number;
	fromUu: {
		parentUu: {
			name: string;
			status: number;
			uuid: string;
		};
		uuid: string;
		code: string;
		name: string;
	};
	toUu: {
		parentUu: {
			uuid: string;
			code: string;
			name: string;
		};
		uuid: string;
		code: string;
		name: string;
	};
	moneyTotal: number;
	status: number;
	state: number;
	code: string;
	uuid: string;
	currentShift: number;
	countWs: number;
	weightSessionUu: {
		truckUu: {
			code: string;
			licensePalate: string;
			status: number;
			uuid: string;
		};
		status: number;
		code: string;
		uuid: string;
	};
	weigth1: number;
	weigth2: number;
	port: string;
	shipTempUu: {
		code: string;
		licensePalate: string;
		uuid: string;
	};
	isNeedConfirmReject: number;
}
