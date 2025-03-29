import {useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './Table.module.scss';

interface Column {
	title: string | React.ReactNode;
	render: (data: any, index: number) => React.ReactNode;
	className?: string;
	checkBox?: boolean;
	textAlign?: 'start' | 'center' | 'end';
	fixedLeft?: boolean;
	fixedRight?: boolean;
}

interface PropsTable {
	data: any[];
	column: Column[];
	onSetData?: (data: (prev: any[]) => any[]) => void;
	fixedHeader?: boolean;
}

function Table({data, column, onSetData, fixedHeader = false}: PropsTable) {
	const tableContainerRef = useRef<HTMLDivElement>(null);
	const thRefs = useRef<(HTMLTableHeaderCellElement | null)[]>([]);
	const [columnWidths, setColumnWidths] = useState<number[]>([]);

	useEffect(() => {
		const updateColumnWidths = () => {
			if (thRefs.current.length > 0) {
				const widths = thRefs.current.map((th) => th?.offsetWidth || 0);
				setColumnWidths(widths);
			}
		};

		updateColumnWidths();
		window.addEventListener('resize', updateColumnWidths);
		return () => {
			window.removeEventListener('resize', updateColumnWidths);
		};
	}, []);

	const fixedLeftPositions = useMemo(() => {
		let left = 0;
		return column.map((col, index) => {
			if (col.fixedLeft) {
				const position = left;
				left += columnWidths[index] || 0;
				return position;
			}
			return null;
		});
	}, [column, columnWidths]);

	const fixedRightPositions = useMemo(() => {
		let right = 0;
		return column.map((col, index) => {
			if (col.fixedRight) {
				const position = right;
				right += columnWidths[index] || 0;
				return position;
			}
			return null;
		});
	}, [column, columnWidths]);

	return (
		<div ref={tableContainerRef} className={clsx(styles.container, {[styles.fixedHeader]: fixedHeader})}>
			<table>
				<thead>
					<tr>
						{column.map((col, i) => (
							<th
								key={i}
								ref={(el) => (thRefs.current[i] = el)}
								className={clsx(
									styles[col.textAlign || 'textStart'],
									col.fixedLeft && styles.fixedLeft,
									col.fixedRight && styles.fixedRight
								)}
								style={{
									...(col.fixedLeft ? {left: fixedLeftPositions[i] || 0} : {}),
									...(col.fixedRight ? {right: fixedRightPositions[i] || 0} : {}),
								}}
							>
								{col.title}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr key={rowIndex} className={styles.tr_data}>
							{column.map((col, colIndex) => (
								<td
									key={colIndex}
									className={clsx(col.fixedLeft && styles.fixedLeft, col.fixedRight && styles.fixedRight)}
									style={{
										...(col.fixedLeft ? {left: fixedLeftPositions[colIndex] || 0} : {}),
										...(col.fixedRight ? {right: fixedRightPositions[colIndex] || 0} : {}),
									}}
								>
									{col.render(row, rowIndex)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default Table;
