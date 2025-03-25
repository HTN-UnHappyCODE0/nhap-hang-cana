import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const weightSessionServices = {
	listWeightsession: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number[];
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			scalesType: number[];
			billUuid: string;
			storageUuid: string;
			isBatch: number | null;
			timeStart: string | null;
			timeEnd: string | null;
			specUuid: string | null;
			codeStart: number | null;
			codeEnd: number | null;
			productTypeUuid?: string | null;
			shift?: number | null;
			shipUuid?: string;
			truckUuid: string;
			listTruckUuid: string[];
			customerUuid: string;
			listCustomerUuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/get-list-weightsession`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateSpecWeightSession: (
		data: {
			wsUuids: string[];
			lstValueSpec: {
				uuid: string;
				value: number;
			}[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/update-spec`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateDrynessWeightSession: (
		data: {
			wsUuids: string[];
			dryness: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/update-dryness`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateKCSWeightSession: (
		data: {
			wsUuids: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/update-kcs-weightsession`, data, {
			cancelToken: tokenAxios,
		});
	},
	getListWeightSessionGroupTruck: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number[];
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			scalesType: number[];
			billUuid: string;
			truckUuid: string[];
			storageUuid: string;
			customerUuid: string;
			productTypeUuid: string;
			isBatch: number | null;
			timeStart: string | null;
			timeEnd: string | null;
			specUuid: string;
			codeStart: number | null;
			codeEnd: number | null;
			shift: number | null;
			groupBy: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/get-list-weightsession-group-truck`, data, {
			cancelToken: tokenAxios,
		});
	},
	dashbroadWeightsession: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number[];
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			scalesType: number[];
			billUuid: string;
			truckUuid: string;
			listTruckUuid: string[];
			storageUuid: string;
			productTypeUuid: string;
			shipUuid: string;
			isBatch: number | null;
			timeStart: string | null;
			timeEnd: string | null;
			specUuid: string;
			codeStart: number | null;
			codeEnd: number | null;
			shift: number | null;
			customerUuid: string;
			listCustomerUuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/WeightSession/dashbroad-weightsession`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default weightSessionServices;
