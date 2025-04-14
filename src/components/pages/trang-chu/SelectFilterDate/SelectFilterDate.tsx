import React, {useEffect, useState} from 'react';

import TippyHeadless from '@tippyjs/react/headless';
import {ArrowDown2, Calendar} from 'iconsax-react';
import clsx from 'clsx';

import {PropsSelectFilterDate} from './interfaces';
import styles from './SelectFilterDate.module.scss';
import FilterDateOption from './FilterDateOption';
import {getDateRange, getTextDateRange} from '~/common/funcs/selectDate';
import Moment from 'react-moment';
import {TYPE_DATE} from '~/constants/config/enum';

function SelectFilterDate({date, setDate, typeDate, setTypeDate, isOptionDateAll}: PropsSelectFilterDate) {
	const [openDate, setOpenDate] = useState<boolean>(false);

	useEffect(() => {
		if (Number(typeDate) != TYPE_DATE.LUA_CHON) {
			setDate(() => getDateRange(Number(typeDate))!);
		} else {
			if (!!date?.from && !!date.to) {
				setDate(() => ({
					from: date?.from,
					to: date.to,
				}));
			}
		}
	}, [typeDate]);

	useEffect(() => {
		if (!isOptionDateAll && !typeDate) {
			setTypeDate(TYPE_DATE.THIS_WEEK);
		}
	}, [isOptionDateAll, typeDate]);

	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={openDate}
			onClickOutside={() => setOpenDate(false)}
			placement='bottom-start'
			render={() => (
				<FilterDateOption
					date={date}
					setDate={setDate}
					typeDate={typeDate}
					setTypeDate={setTypeDate}
					show={openDate}
					setShow={setOpenDate}
					isOptionDateAll={isOptionDateAll}
				/>
			)}
		>
			<div className={clsx(styles.btn_filter, {[styles.active]: openDate})} onClick={() => setOpenDate(!openDate)}>
				<div className={styles.box_icon}>
					<Calendar size={16} color='#6F767E' />
					<p>
						<span style={{fontWeight: 500, marginRight: 4}}>Thời gian: </span>
						{Number(typeDate) == TYPE_DATE.LUA_CHON ? (
							<span className={styles.value}>
								<Moment date={date?.from!} format='DD/MM/YYYY' /> - <Moment date={date?.to!} format='DD/MM/YYYY' />
							</span>
						) : (
							<span className={styles.value}>{getTextDateRange(typeDate)}</span>
						)}
					</p>
				</div>
				<div className={styles.arrow}>
					<ArrowDown2 size={16} />
				</div>
			</div>
		</TippyHeadless>
	);
}

export default SelectFilterDate;
