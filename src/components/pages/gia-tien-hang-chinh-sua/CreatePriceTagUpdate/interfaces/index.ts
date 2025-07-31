export interface PropsCreatePriceTagUpdate {}

export interface IFormCreatePriceTagUpdate {
	scalesStationUu: ScalesStationUu;
	lstTruck: Truck[];
	isPrint: number;
	isSift: number;
	timeStart: string;
	timeEnd: string | null;
	updatedTime: string;
	created: string;
	documentId: string;
	accountUu: AccountUu;
	accountUpdateUu: any | null;
	description: string;
	qualityUu: QualityUu;
	weightTotal: number;
	customerName: string | null;
	scalesType: number;
	transportType: number;
	specificationsUu: SpecificationsUu;
	batchsUu: BatchsUu;
	productTypeUu: ProductTypeUu;
	pricetagUu: PricetagUu;
	isBatch: number;
	fromUu: FromUu;
	toUu: ToUu;
	moneyTotal: number;
	currentShift: number;
	status: number;
	code: string;
	countWs: number;
	state: number;
	uuid: string;
}

interface ScalesStationUu {
	code: string;
	name: string;
	status: number;
	warehouseUu: any | null;
	uuid: string;
}

interface Truck {
	code: string;
	licensePlate: string;
	status: number;
	uuid: string;
}

interface AccountUu {
	username: string;
	status: number;
	uuid: string;
}

interface QualityUu {
	name: string;
	status: number;
	uuid: string;
}

interface SpecificationsUu {
	name: string;
	status: number;
	qualityUu: QualityUu;
	uuid: string;
}

interface BatchsUu {
	uuid: string;
	name: string | null;
	shipUu: any | null;
	shipOutUu: any | null;
	isShip: number;
	weightIntent: number;
	timeIntend: string;
}

interface ProductTypeUu {
	code: string;
	name: string;
	status: number;
	type: number;
	uuid: string;
}

interface PricetagUu {
	code: string;
	amount: number;
	status: number;
	uuid: string;
}

interface ParentUu {
	uuid: string;
	code: string;
	name: string;
}

interface FromUu {
	parentUu: ParentUu;
	uuid: string;
	code: string;
	name: string;
}

interface ToUu {
	parentUu: ParentUu;
	uuid: string;
	code: string;
	name: string;
}
