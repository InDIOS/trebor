interface CalendarItem {
  active?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

interface Day extends CalendarItem {
  day: number;
}

interface Week {
  days: Day[];
  end: number;
  start: number;
  weekYear: number;
}

interface Month extends CalendarItem {
  month: string;
  value: number;
}

interface Year extends CalendarItem {
  year: number;
}

export default {
  attrs: {
    value: {
      type: 'date',
      default: () => new Date()
    },
    show: {
      type: 'boolean',
      default: true
    },
    place: {
      type: 'string',
      default: 'right'
    },
    labelTemplate: {
      type: 'string',
      default: '${month} of ${year}'
    },
    options: {
      type: 'object',
      default: () => ({
        daysOfWeek: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
        months: [
          'January', 'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October', 'November', 'Dicember',
        ]
      })
    }
  },
  didMount() {
    this.$set('date', new Date(this.value.valueOf()));
    this.createCalendar(this.date.getMonth(), this.date.getFullYear());
  },
  model: {
    view: '',
    month: [],
    date: new Date(),
    get viewLabel() {
      switch (this.view) {
        case 'months':
          return this.date.getFullYear();
        case 'years':
          let part = this.date.getFullYear().toString().substring(0, 3);
          return `${part}0 - ${part}9`;
        default:
          return this.labelTemplate
            .replace(/\${day}/g, this.date.getDate() + '')
            .replace(/\${month}/g, this.options.months[this.date.getMonth()])
            .replace(/\${year}/g, this.date.getFullYear() + '');
      }
    },
    get decade() {
      return this.yearInDecade(this.date.getFullYear());
    },
    get months(): Month[] {
      let d = new Date();
      return this.options.months.map((month, i) => ({
        value: i, month: month.substring(0, 3),
        active: d.getMonth() === i && d.getFullYear() === this.date.getFullYear()
      }));
    },
    get visibility() {
      if (!this.show) {
        this.$set('view', '');
      }
      return this.show;
    },
    selectView() {
      this.$set('view', this.view === '' ? 'months' : 'years');
    },
    itemState(item: Day | Month | Year) {
      return { active: item.active, disabled: item.disabled, selected: item.selected };
    },
    resetDate() {
      this.$set('date', new Date());
      this.$fire('change', new Date());
      this.createCalendar(this.date.getMonth(), this.date.getFullYear());
    },
    resetDaySelection() {
      this.month.forEach(week => {
        week.days.forEach(day => {
          day.selected && (day.selected = false);
        });
      });
    },
    selectDay(day: Day) {
      if (!day.disabled) {
        this.resetDaySelection();
        let date = new Date(this.date.getFullYear(), this.date.getMonth(), day.day);
        this.$fire('change', date);
        day.selected = true;
        this.$update();
      }
    },
    selectMonth(month: Month) {
      if (!month.disabled) {
        this.date.setMonth(month.value);
        this.createCalendar(this.date.getMonth(), this.date.getFullYear());
        this.$set('view', '');
      }
    },
    selectYear(year: Year) {
      if (!year.disabled) {
        this.date.setFullYear(year.year);
        this.$set('view', 'months');
      }
    },
    weekOfYear(day: number, month: number, year: number) {
      let target = new Date(year, month, day);
      let dayNr = (target.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      let firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
      }
      return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
    },
    monthOfYear(row: number) {
      switch (row) {
        case 1:
          return this.months.slice(4, 8);
        case 2:
          return this.months.slice(8);
        default:
          return this.months.slice(0, 4);
      }
    },
    yearOfDecade(row: number) {
      switch (row) {
        case 1:
          return this.decade.slice(4, 8);
        case 2:
          return this.decade.slice(8);
        default:
          return this.decade.slice(0, 4);
      }
    },
    yearInDecade(year: number) {
      let now = new Date();
      let range: Year[] = [];
      let text = year.toString();
      let first = parseInt(text.substring(0, text.length - 1) + 0);
      for (let i = 0; i < 12; i++) {
        if (i === 0) {
          range[i] = { year: first - 1, disabled: true, };
        } else if (i === 11) {
          range[i] = { year: first + 10, disabled: true, };
        } else {
          let y = first + i - 1;
          range[i] = { year: y, active: y === now.getFullYear() };
        }
      }
      return range;
    },
    daysOfMonth(month: number, year: number) {
      return 32 - new Date(year, month, 32).getDate();
    },
    createCalendar(month: number, year: number) {
      let date = new Date(year, month, 1).getDay();
      let numDays = this.daysOfMonth(month, year);
      let lastDay = this.daysOfMonth(month - 1, year);

      let start = 1;
      let end = 7 - date;
      let d = new Date();
      let weeks: Week[] = [];
      while (start <= numDays) {
        let days: Day[] = [];
        let length = end - start + 1;
        for (let i = 0; i < length; i++) {
          days[i] = {
            day: start + i,
            active: (start + i) === d.getDate() && d.getMonth() === month && d.getFullYear() === year
          };
        }
        if (days.length < 7 && start === 1) {
          for (let i = 0; i < date; i++) {
            days.unshift({ day: lastDay - i, disabled: true });
          }
        } else if (days.length < 7 && days.length > 0) {
          let nend = 7 - days.length;
          for (let i = 1; i <= nend; i++) {
            days[days.length] = { day: i, disabled: true };
          }
        }
        let week = {
          start, end, days,
          weekYear: this.weekOfYear(end, month, year)
        };
        weeks[weeks.length] = week;
        start = end + 1;
        end = start === 1 && end === 8 ? 1 : end + 7;
        if (end > numDays) {
          end = numDays;
        }
      }

      if (weeks.length === 4 || date === 0) {
        let days: Day[] = [];
        for (let i = 0; i < 7; i++) {
          days[6 - i] = { day: lastDay - i, disabled: true };
        }
        let start = days[0].day;
        let end = days[days.length - 1].day;
        weeks.unshift({
          start, end, days,
          weekYear: this.weekOfYear(end, month - 1, year)
        });
      }

      if (weeks.length === 5) {
        let days = [];
        let start = 1;
        let end = 7;
        let lastWeek = weeks[weeks.length - 1];
        let lastDay = lastWeek.days[lastWeek.days.length - 1];
        if (!~[28, 29, 30, 31].indexOf(lastDay.day)) {
          start = lastDay.day + 1;
          end = 6 + start;
        }
        for (let i = 0; i < 7; i++) {
          days[i] = { day: start + i, disabled: true };
        }
        weeks.push({
          start, end, days,
          weekYear: this.weekOfYear(end, month + 1, year)
        });
      }

      this.$set('month', weeks);
    },
    prev() {
      if (this.view === 'years') {
        this.date = new Date(this.date.getFullYear() - 10, this.date.getMonth(), this.date.getDate());
      } else if (this.view === 'months') {
        this.date = new Date(this.date.getFullYear() - 1, this.date.getMonth(), this.date.getDate());
      } else {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
        this.createCalendar(this.date.getMonth(), this.date.getFullYear());
      }
      this.$update();
    },
    next() {
      if (this.view === 'years') {
        this.date = new Date(this.date.getFullYear() + 10, this.date.getMonth(), this.date.getDate());
      } else if (this.view === 'months') {
        this.date = new Date(this.date.getFullYear() + 1, this.date.getMonth(), this.date.getDate());
      } else {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
        this.createCalendar(this.date.getMonth(), this.date.getFullYear());
      }
      this.$update();
    }
  }
};