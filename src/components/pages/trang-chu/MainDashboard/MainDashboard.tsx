import React from 'react';

import {PropsMainDashboard} from './interfaces';
import styles from './MainDashboard.module.scss';
import ChartImportCompany from '../ChartImportCompany';
import ChartStackArea from '../ChartStackArea';
import ChartStackStatisticsByDay from '../ChartStackStatisticsByDay';

function MainDashboard({}: PropsMainDashboard) {
	return (
		<div className={styles.container}>
			<ChartImportCompany />
			<ChartStackArea />
			<ChartStackStatisticsByDay />
		</div>
	);
}

export default MainDashboard;
