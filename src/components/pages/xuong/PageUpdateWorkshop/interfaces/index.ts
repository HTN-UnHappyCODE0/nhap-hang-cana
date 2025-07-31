import {TYPE_SIFT, TYPE_TRANSPORT} from '~/constants/config/enum';

export interface PropsPageUpdateWorkshop {}

export interface IFormUpdateWorkshop {
	name: string;
	userUuid: string;
	director: string;
	partnerUuid: string;
	email: string;
	phoneNumber: string;
	provinceId: string;
	townId: string;
	address: string;
	description: string;
	transportType: TYPE_TRANSPORT | null;
	isSift: TYPE_SIFT | null;
	warehouseUuid: string;
	typeCus: number;
}
