import clsx from 'clsx';

import styles from './DateRangerCustom.module.scss';
import {ArrowDown2} from 'iconsax-react';
import {useEffect, useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import DateTypeOption from './DateTypeOption';
import {TYPE_DATE} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import {PropsDateRangerCustom} from './interfaces';
import {getDateRange, getTextDateRange} from '~/common/funcs/selectDate';
import {timeSubmit} from '~/common/funcs/optionConvert';
import {RiCalendarScheduleLine} from 'react-icons/ri';
import Moment from 'react-moment';

function DateRangerCustom({
	titleTime,
	keyTypeDate = '_typeDate',
	keyDateForm = '_dateFrom',
	keyDateTo = '_dateTo',
	typeDateDefault = TYPE_DATE.THIS_WEEK,
	typeDateNotShow = [],
}: PropsDateRangerCustom) {
	const router = useRouter();

	const {[keyTypeDate]: typeDate, [keyDateForm]: dateForm, [keyDateTo]: dateTo} = router.query;

	const [show, setShow] = useState<boolean>(false);

	const [date, setDate] = useState<{
		from: Date | null;
		to: Date | null;
	} | null>(null);

	useEffect(() => {
		if (Number(typeDate) != TYPE_DATE.LUA_CHON) {
			setDate(() => getDateRange(Number(typeDate))!);
		} else {
			if (!!dateForm && !!dateTo) {
				setDate(() => ({
					from: new Date(dateForm as string),
					to: new Date(timeSubmit(new Date(dateTo as string)) as string),
				}));
			}
		}
	}, [typeDate]);

	useEffect(() => {
		if (date?.from && date?.to) {
			router.replace(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						[keyDateForm]: date?.from ? timeSubmit(date?.from) : '',
						[keyDateTo]: date?.to ? timeSubmit(date?.to, true) : '',
					},
				},
				undefined,
				{scroll: false}
			);
		}
	}, [date?.from, date?.to]);

	useEffect(() => {
		if (!!typeDateDefault) {
			router.replace(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						[keyTypeDate]: typeDateDefault,
					},
				},
				undefined,
				{scroll: false}
			);
		}
	}, [typeDateDefault]);

	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={show}
			onClickOutside={() => setShow(false)}
			placement='bottom-start'
			render={() => (
				<DateTypeOption
					date={date}
					setDate={setDate}
					show={show}
					setShow={setShow}
					keyTypeDate={keyTypeDate}
					keyDateForm={keyDateForm}
					keyDateTo={keyDateTo}
					typeDateNotShow={typeDateNotShow}
				/>
			)}
		>
			<div className={clsx(styles.container, {[styles.focus]: show})} onClick={() => setShow(!show)}>
				<RiCalendarScheduleLine />

				<span className={styles.text_value}>
					{titleTime && <span className={styles.title}>{`${titleTime}:`}</span>}
					{date?.from && date?.to ? (
						<>
							{Number(typeDate) == TYPE_DATE.LUA_CHON ? (
								<span className={styles.value}>
									<Moment date={date?.from} format='DD/MM/YYYY' /> - <Moment date={date?.to} format='DD/MM/YYYY' />
								</span>
							) : (
								<span className={styles.value}>{getTextDateRange(Number(typeDate))}</span>
							)}
						</>
					) : (
						<span className={styles.value}>Tất cả</span>
					)}
				</span>

				<div className={clsx(styles.icon_arrow, {[styles.active_icon]: show})}>
					<ArrowDown2 size={16} />
				</div>
			</div>
		</TippyHeadless>
	);
}

export default DateRangerCustom;
