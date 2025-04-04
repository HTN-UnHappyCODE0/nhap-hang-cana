import {WEIGHT_WAREHOUSE} from '~/constants/config';

export default function convertPositonStorage(numberId: number, weight: number): string {
	// Kích thước lưới là 10x10
	const gridSize = 20;

	const quantity = Math.ceil((weight / (WEIGHT_WAREHOUSE * 100)) * 100);

	// Hàm lấy hàng và cột từ id
	function getRowCol(id: number) {
		const row = Math.floor((id - 1) / gridSize);
		const col = (id - 1) % gridSize;
		return [row, col];
	}

	// Hàm lấy id từ hàng và cột
	function getId(row: number, col: number) {
		return row * gridSize + col + 1;
	}

	const [startRow, startCol] = getRowCol(numberId); // Lấy hàng và cột từ id đầu vào

	// Tính kích thước của hình chữ nhật cần thiết
	let rectWidth = Math.ceil(Math.sqrt(quantity)); // Chiều rộng của hình chữ nhật
	let rectHeight = Math.ceil(quantity / rectWidth); // Chiều cao của hình chữ nhật

	// Điều chỉnh kích thước nếu cần để chứa chính xác số lượng ô yêu cầu
	while (rectWidth * rectHeight < quantity) {
		rectWidth++; // Tăng chiều rộng
		if (rectWidth * rectHeight >= quantity) break; // Thoát nếu đã đủ số lượng ô
		rectHeight++; // Tăng chiều cao
	}

	// Khởi tạo góc trên cùng bên trái để đảm bảo id đầu vào nằm ở góc trên bên trái
	let topLeftRow = startRow;
	let topLeftCol = startCol;

	// Đảm bảo hình chữ nhật không vượt ra ngoài lưới
	if (topLeftRow + rectHeight > gridSize) topLeftRow = gridSize - rectHeight;
	if (topLeftCol + rectWidth > gridSize) topLeftCol = gridSize - rectWidth;

	const ids = []; // Mảng lưu trữ các id của hình chữ nhật

	// Thu thập các id của hình chữ nhật từ góc trên cùng bên trái
	for (let i = 0; i < rectHeight; i++) {
		for (let j = 0; j < rectWidth; j++) {
			const newRow = topLeftRow + i; // Hàng mới
			const newCol = topLeftCol + j; // Cột mới
			const newId = getId(newRow, newCol); // Lấy id từ hàng và cột

			// Chỉ thêm id vào mảng nếu nó nằm trong khoảng từ 1 đến 100
			if (newId >= 1 && newId <= 100) {
				ids.push(newId); // Thêm id vào mảng
			}
			if (ids.length === quantity) break; // Dừng lại khi đã đạt đủ số lượng yêu cầu
		}
		if (ids.length === quantity) break; // Dừng lại khi đã đạt đủ số lượng yêu cầu
	}

	const a = ids?.sort((a, b) => a - b);

	return JSON.stringify(a);
}

// Hàm lấy số cột và số hàng của mảng elements
export const calculateDimensions = (elements: number[], numCols: number) => {
	const [start, end] = [Math.min(...elements), Math.max(...elements)];

	const startRow = Math.floor((start - 1) / numCols);
	const endRow = Math.floor((end - 1) / numCols);
	const startCol = (start - 1) % numCols;
	const endCol = (end - 1) % numCols;

	const numRows = endRow - startRow + 1;
	const numColumns = endCol - startCol + 1;

	return {
		numRows: numRows,
		numColumns: numColumns,
	};
};
