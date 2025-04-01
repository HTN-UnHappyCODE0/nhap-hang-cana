import {TYPE_DATE} from '~/constants/config/enum';

export interface PropsDateRangerCustom {
	titleTime?: string;
	keyTypeDate?: string;
	keyDateForm?: string;
	keyDateTo?: string;
	typeDateDefault?: TYPE_DATE;
	typeDateNotShow?: TYPE_DATE[];
}
