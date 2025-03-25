import moment from 'moment';
import md5 from 'md5';
import {TYPE_SCALES} from '~/constants/config/enum';

export function obfuscateEmail(email: string) {
	// Tách phần trước @ và phần tên miền
	const [username, domain] = email.split('@');

	// Giữ lại ký tự đầu tiên và cuối cùng của tên người dùng
	const firstChar = username[0];
	const lastChar = username[username.length - 1];

	// Tạo phần che giấu giữa
	const middleHidden = '...';

	// Tạo tên người dùng mới với phần che giấu
	const newUsername = firstChar + middleHidden + lastChar;

	// Kết hợp với tên miền để tạo email đã che giấu
	const obfuscatedEmail = newUsername + '@' + domain;

	return obfuscatedEmail;
}

export function checkTime(i: any) {
	if (Math.abs(i) < 10) {
		i = '0' + i;
	}
	return i;
}

export const timeSubmit = (date: Date | null | undefined, isTo?: boolean) => {
	return date
		? `${date.getFullYear()}-${checkTime(date.getMonth() + 1)}-${checkTime(date.getDate())}T${isTo ? '23:59:59' : '00:00:00'}`
		: null;
};

export function getKeyCert(): {
	time: string;
	keyCert: string;
} {
	const key: string = process.env.NEXT_PUBLIC_KEY_CERT!;
	const time = moment(new Date()).format('MM/DD/YYYY HH:mm:ss');
	return {
		time: time,
		keyCert: md5(`${key}${time}`),
	};
}

export function removeVietnameseTones(str: string): string {
	str = str?.toLowerCase();
	str = str?.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
	str = str?.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
	str = str?.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
	str = str?.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
	str = str?.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
	str = str?.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
	str = str?.replace(/đ/g, 'd');
	return str;
}

export function getTextAddress(detailAddress: any, address?: string): string {
	if (address) {
		return `${address || '---'}, ${detailAddress?.town?.name || '---'}, ${detailAddress?.district?.name || '---'}, ${
			detailAddress?.province?.name || '---'
		}`;
	} else {
		return `${detailAddress?.town?.name || '---'}, ${detailAddress?.district?.name || '---'}, ${
			detailAddress?.province?.name || '---'
		}`;
	}
}

export function getFromToBatchBill(data: {
	scalesType: TYPE_SCALES;
	fromUu?: any;
	toUu?: any;
	customerUu?: any;
	customerName?: string | null;
}): {
	from: string;
	to: string;
} {
	if (data.scalesType == TYPE_SCALES.CAN_NHAP) {
		return {
			from: data?.fromUu?.name || '---',
			to: data?.toUu?.name || '---',
		};
	}

	if (data.scalesType == TYPE_SCALES.CAN_XUAT) {
		return {
			from: data?.fromUu?.name || '---',
			to: data?.toUu?.name || '---',
		};
	}

	if (data.scalesType == TYPE_SCALES.CAN_DICH_VU) {
		return {
			from: data?.customerName || data?.customerUu?.name || data?.fromUu?.name || '---',
			to: data?.toUu?.name || '---',
		};
	}

	if (data.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO) {
		return {
			from: data?.fromUu?.name || '---',
			to: data?.toUu?.name || '---',
		};
	}
	return {
		from: '---',
		to: '---',
	};
}

export function convertWeight(weight: number | null) {
	if (!weight) {
		return 0;
	}

	return (weight / 1000).toLocaleString('vi-VN', {minimumFractionDigits: 3, maximumFractionDigits: 3});
}

export function formatDrynessAvg(drynessAvg: number | null) {
	if (!drynessAvg) {
		return 0;
	}

	const roundedNum = Math.floor(drynessAvg * 100) / 100;

	return roundedNum.toFixed(2).replace('.', ',');
}

export function generateLinearGradient(colors: string) {
	return `linear-gradient(180deg, ${colors})`;
}
