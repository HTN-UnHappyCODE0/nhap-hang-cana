import {TYPE_SIFT, TYPE_TRANSPORT} from '~/constants/config/enum';

export interface PropsPageCreateWorkshop {}
export interface IFormCreateWorkshop {
	name: string;
	userUuid: string;
	director: string;
	email: string;
	phoneNumber: string;
	provinceId: string;
	partnerUuid: string;
	townId: string;
	address: string;
	description: string;
	transportType: TYPE_TRANSPORT | null;
	isSift: TYPE_SIFT | null;
	warehouseUuid: string;
}
