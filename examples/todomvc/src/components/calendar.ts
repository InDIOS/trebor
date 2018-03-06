// interface YearItem {
// 	year: number;
// 	active?: boolean;
// 	disabled?: boolean;
// }

interface WeekItem {
	start: number;
	end: number;
	days: DayItem[];
	weekMonth: number;
	weekYear: number;
}

interface DayItem {
	day: number;
	active?: boolean;
	disabled?: boolean;
}

// const weekDays = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'];
// const months = [
// 	'Enero', 'Febrero', 'Marzo',
// 	'Abril', 'Mayo', 'Junio',
// 	'Julio', 'Agosto', 'Septiembre',
// 	'Octubre', 'Noviembre', 'Diciembre',
// ];

function weekOfYear(day: number, month: number, year: number) {
	let target = new Date(year, month, day);
	let dayNr = (target.getDay() + 6) % 7;
	target.setDate(target.getDate() - dayNr + 3);
	let firstThursday = target.valueOf();
	target.setMonth(0, 1);
	if (target.getDay() !== 4) {
		target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
	}
	return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

// function yearInDecade(year: number) {
// 	const range: YearItem[] = [];
// 	const text = year.toString();
// 	const lastDigit = parseInt(text.charAt(text.length - 1));
// 	for (let i = 0; i < lastDigit; i++) {
// 		const y = parseInt(text.substring(0, text.length - 1) + i);
// 		range.push({ year: y, active: year === y });
// 	}

// 	for (let i = lastDigit; i < 10; i++) {
// 		const y = parseInt(text.substring(0, text.length - 1) + i);
// 		range.push({ year: y, active: year === y });
// 	}

// 	range.unshift({
// 		year: range[0].year - 1,
// 		disabled: true,
// 	});

// 	range.push({
// 		year: range[10].year + 1,
// 		disabled: true,
// 	});

// 	return range;
// }

function weeksOfMonth(month: number, year: number) {
	const date = new Date(year, month, 1).getDay();
	const numDays = 32 - new Date(year, month, 32).getDate();

	const weeks: WeekItem[] = [];
	let start = 1;
	let end = 7 - date;
	let d = new Date();
	while (start <= numDays) {
		let days: DayItem[] = [];
		for (let j = start; j <= end; j++) {
			let day = { day: j, active: j === d.getDate() && d.getMonth() === month && d.getFullYear() === year };
			days.push(day);
		}
		if (days.length < 7 && start === 1) {
			for (let i = date; i > 0; i--) {
				let day = { day: new Date(year, month, (date - i) * -1).getDate(), disabled: true };
				days.unshift(day);
			}
		} else if (days.length < 7 && days.length > 0) {
			let nend = 7 - days.length;
			for (let j = 1; j <= nend; j++) {
				let day = { day: j, disabled: true };
				days.push(day);
			}
		}
		let week = {
			start, end, days,
			weekMonth: weeks.length + 1,
			weekYear: weekOfYear(end, month, year)
		};
		weeks.push(week);
		start = end + 1;
		end = start === 1 && end === 8 ? 1 : end + 7;
		if (end > numDays) {
			end = numDays;
		}
	}

	if (weeks.length === 5) {
		const days: DayItem[] = [];
		let start = 1;
		let end = 7;
		const lastWeek = weeks[4];
		const lastDay = lastWeek.days[lastWeek.days.length - 1];
		if (!~[28, 29, 30, 31].indexOf(lastDay.day)) {
			start = lastDay.day + 1;
			end = 6 + start;
		}
		for (let j = start; j <= end; j++) {
			let day = { day: j, disabled: true };
			days.push(day);
		}
		weeks.push({
			start, end, days, weekMonth: 6,
			weekYear: weekOfYear(end, month + 1, year)
		});
	}

	return weeks;
}

const model = {
	currentDate: new Date(),
	monthWeeks: [],
	mounted() {
		const month = this.currentDate.getMonth();
		const year = this.currentDate.getFullYear();
		this.monthWeeks = weeksOfMonth(month, year);
	}
};

export default { model };