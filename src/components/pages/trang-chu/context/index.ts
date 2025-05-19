import {createContext, useContext} from 'react';

export interface IContextPageHome {
	date: {from: Date | null; to: Date | null} | null;
	provinceUuid: string[];
	listCompanyUuid: string[];
	listUserPurchasingUuid: string[];
	listPartnerUuid: string[];
	listUserOwnerUuid: string[];
	listCustomerUuid: string[];
}

export const ContextPageHome = createContext<IContextPageHome>({
	date: null,
	provinceUuid: [],
	listCompanyUuid: [],
	listUserPurchasingUuid: [],
	listPartnerUuid: [],
	listUserOwnerUuid: [],
	listCustomerUuid: [],
});

export const usePageHomeContext = () => useContext(ContextPageHome);
