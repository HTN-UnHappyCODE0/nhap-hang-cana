import React, {memo} from 'react';

import {PropsItemDashboard} from './interfaces';
import styles from './ItemDashboard.module.scss';
import {convertCoin} from '~/common/funcs/convertCoin';
import {ChartSquare} from 'iconsax-react';
import clsx from 'clsx';
import {convertWeight} from '~/common/funcs/optionConvert';

function ItemDashboard({isTotal, value, text, background, textColor}: PropsItemDashboard) {
	return (
		<div className={clsx(styles.container, {[styles.isTotal]: isTotal})}>
			<div>
				<h5 className={styles.value} style={{color: textColor}}>
					{convertWeight(value)}
				</h5>
				<p className={styles.text}>{text}</p>
			</div>
			<div style={{background: background}} className={styles.box}>
				<ChartSquare size='24' color='#fff' variant='Bold' />
			</div>
		</div>
	);
}

export default memo(ItemDashboard);
