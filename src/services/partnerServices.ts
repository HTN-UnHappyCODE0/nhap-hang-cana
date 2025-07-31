import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, CONFIG_STATUS} from '~/constants/config/enum';
import axiosClient from '.';

const partnerServices = {
	listPartner: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			userUuid: string;
			provinceId: string;
			type: number | null;
			listCompanyUuid?: string[];
			listUserUuid?: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/get-list-partner`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatus: (
		data: {
			uuid: string;
			status: CONFIG_STATUS;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/change-status-partner`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertPartner: (
		data: {
			uuid: string;
			name: string;
			type: number;
			taxCode: string;
			phoneNumber: string;
			email: string;
			director: string;
			provinceId: string;
			townId: string;
			address: string;
			description: string;
			userOwenerUuid: string;
			bankName: string;
			bankAccount: string;
			companyUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/upsert-partner`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailPartner: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/detail-partner`, data, {
			cancelToken: tokenAxios,
		});
	},
	partnerAddCustomer: (
		data: {
			partnerUuid: string;
			customersUuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/add-customer`, data, {
			cancelToken: tokenAxios,
		});
	},
	partnerDeleteCustomer: (
		data: {
			partnerUuid: string;
			customersUuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/remove-customer`, data, {
			cancelToken: tokenAxios,
		});
	},
	listPartnerDebt: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			userUuid: string;
			provinceId: string;
			type: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/get-list-partner-debt`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailPartnerDebt: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/detail-partner-debt`, data, {
			cancelToken: tokenAxios,
		});
	},
	dashbroadPartner: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isDescending: number;
			typeFind: number;
			isPaging: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/dashbroad-partner-debt`, data, {
			cancelToken: tokenAxios,
		});
	},
	removeCustomer: (
		data: {
			partnerUuid: string;
			customersUuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Partner/remove-customer`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default partnerServices;
