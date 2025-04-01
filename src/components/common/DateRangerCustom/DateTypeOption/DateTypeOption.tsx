import {ListOptionTimePicker} from '~/constants/config';
import styles from './DateTypeOption.module.scss';
import clsx from 'clsx';
import TippyHeadless from '@tippyjs/react/headless';
import RangeDatePicker from '~/components/common/RangeDatePicker';
import {PropsDateTypeOption} from './interfaces';
import {TYPE_DATE} from '~/constants/config/enum';
import {useRouter} from 'next/router';

function DateTypeOption({date, show, setDate, setShow, keyTypeDate, keyDateForm, keyDateTo, typeDateNotShow = []}: PropsDateTypeOption) {
	const router = useRouter();

	const {[keyTypeDate]: typeDate} = router.query;

	const setQuery = (value: any) => {
		if (!!value) {
			router.replace(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						[keyTypeDate]: value,
					},
				},
				undefined,
				{shallow: true, scroll: false}
			);
		} else {
			if (!value) {
				const {[keyTypeDate]: typeDate, [keyDateForm]: dateForm, [keyDateTo]: dateTo, ...rest} = router.query;

				router.replace(
					{
						pathname: router.pathname,
						query: {
							...rest,
						},
					},
					undefined,
					{shallow: true, scroll: false}
				);
			}
		}
	};

	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={Number(typeDate) == TYPE_DATE.LUA_CHON}
			placement='right-start'
			render={(attrs) => (
				<div className={styles.main_calender}>
					<RangeDatePicker
						value={date}
						onSetValue={setDate}
						onClose={() => setShow(false)}
						open={show && Number(typeDate) == TYPE_DATE.LUA_CHON}
					/>
				</div>
			)}
		>
			<div className={styles.mainOption}>
				{/* <div
					className={clsx(styles.option, {
						[styles.option_active]: typeDate == null,
					})}
					onClick={() => {
						setShow(false);
						setQuery(null);
					}}
				>
					<p>{'Tất cả'}</p>
				</div> */}
				{ListOptionTimePicker.filter((v) => !typeDateNotShow.includes(v.value)).map((v, i) => (
					<div
						key={i}
						className={clsx(styles.option, {
							[styles.option_active]: Number(typeDate) == v.value,
						})}
						onClick={() => {
							if (v.value !== TYPE_DATE.LUA_CHON) {
								setShow(false);
							}
							setQuery(v.value);
						}}
					>
						<p>{v.name}</p>
					</div>
				))}
			</div>
		</TippyHeadless>
	);
}

export default DateTypeOption;
