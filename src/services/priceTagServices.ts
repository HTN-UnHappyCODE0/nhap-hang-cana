import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';
import axios from 'axios';

const priceTagServices = {
	listPriceTag: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			customerUuid: string | null;
			specUuid: string | null;
			productTypeUuid: string | null;
			priceTagUuid: string;
			transportType?: number | null;
			state: number | null;
			userUuid?: string | null;
			parentUserUuid?: string | null;
			companyUuid?: string;
			qualityUuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/get-list-price-tag-info`, data, {
			cancelToken: tokenAxios,
		});
	},
	listPriceTagHistory: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			state: number | null;
			customerUuid: string | null;
			partnerUuid: string | null;
			productTypeUuid: string | null;
			transportType: number | null;
			specUuid: string | null;
			priceTagUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/history-customer-spec-pricetag`, data, {
			cancelToken: tokenAxios,
		});
	},
	listPriceTagDropDown: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/get-list-pricetag`, data, {
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
		return axiosClient.post(``, data, {
			cancelToken: tokenAxios,
		});
	},
	detailPriceTag: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/detail-pricetag`, data, {
			cancelToken: tokenAxios,
		});
	},
	addPricetagToCustomer: (
		data: {
			infoSpec: {
				specUuid: string | null;
				status: 0 | 1;
				productTypeUuid: string;
				priceTagUuid: string | null;
				state: 0 | 1;
				transportType: number;
				storageUuid?: string;
				qualityUuid?: string;
			}[];
			customerUuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/add-pricetag-to-customer`, data, {
			cancelToken: tokenAxios,
		});
	},
	updatePricetagToCustomer: (
		data: {
			uuid: string;
			priceTagUuid: string;
			status: 0 | 1;
			state: 0 | 1;
			pricetagAfterUuid: string;
			timeStart: string | null;
			timeEnd: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/update-pricetag-to-customer`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetail: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/detail-pricetag`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailCustomerSpec: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/detail-customer-spec`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailFixPricetag: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/detail-fix-pricetag`, data, {
			cancelToken: tokenAxios,
		});
	},
	getListUpdatePriceTag: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			productTypeUuid: string;
			transportType: number | null;
			specificationUuid: string | null; // string -> number
			timeStart: string | null;
			timeEnd: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/history-fix-pricetag`, data, {
			cancelToken: tokenAxios,
		});
	},
	fixPricetag: (
		data: {
			billUuids: string[];
			pricetagUuid: string;
			description: string;
			customerUuid: string;
			producTypeUuid: string;
			specificationUuid: string;
			transportType: number | null;
			timeStart: string | null;
			timeEnd: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/fix-pricetag`, data, {
			cancelToken: tokenAxios,
		});
	},
	listFuturePrice: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			userOwnerUuid: string | null;
			productTypeUuid: string | null;
			userOwnerCompanyUuid: string | null;
			transportType: number | null;
			specificationUuid: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/get-list-future-price`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailFuturePrice: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/detail-future-price`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatusFuturePrice: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/end-future-price`, data, {
			cancelToken: tokenAxios,
		});
	},
	listDailyPrice: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			userOwnerUuid: string | null;
			productTypeUuid: string | null;
			userOwnerCompanyUuid: string | null;
			transportType: number | null;
			dateCheck: string | null;
			companyUuid?: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/get-list-daily-price`, data, {
			cancelToken: tokenAxios,
		});
	},
	dashBoardDailyPrice: (
		data: {
			timeStart: string;
			timeEnd: string;
			userOwnerUuid: string;
			productTypeUuid: string;
			typeFindDay?: number;
			transportType: number | null;
			qualityUUid: string;
			provinceId: string[];
			customerUuid: string[];
			listCompanyUuid: string[];
			listPartnerUuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/PriceTag/dash-board-daily-price`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default priceTagServices;
