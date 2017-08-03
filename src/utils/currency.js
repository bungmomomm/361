// Convert number into IDR Currency

export default function (number) {
	return `Rp ${Number(number).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}`;
}