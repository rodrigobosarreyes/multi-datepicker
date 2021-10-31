import { Component } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-customday',
  templateUrl: './datepicker-customday.html',
  styles: [
    `
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
    .custom-day.faded:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.first, .custom-day.last {
      background-color: rgb(2, 117, 216);
      color: white;
    }
  `,
  ],
})
export class NgbdDatepickerCustomday {
  modelList: Array<NgbDate> = [];

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  range: boolean = false;

  constructor(private readonly calendar: NgbCalendar) {
    this.fromDate = null;
    this.toDate = null;
  }

  isSelected(date: NgbDate): boolean {
    return this.exists(date);
  }

  selectOne(date) {
    if (this.range) {
      if (!this.fromDate && !this.toDate) {
        // Cuando no hay ninguna fecha seleccionada
        this.fromDate = date;
      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
        // Cuando las dos fechas se seleccionan y no es anterior a la fecha de inicio
        this.toDate = date;
      } else if (this.fromDate.equals(date)) {
        this.fromDate = null;
        this.range = false;
        this.toDate = null;
      } else {
        // Cuando se clica fuera del rango
        this.toDate = null;
        this.fromDate = date;
      }

      if (this.fromDate && this.toDate) {
        const diff = this.calculateDiff(this.fromDate, this.toDate);
        let _from = Object.assign({}, this.fromDate);
        this.modelList.push(this.fromDate);
        for (let i = 0; i < diff; i++) {
          _from = this.calendar.getNext(_from);
          const xDate = new NgbDate(_from.year, _from.month, _from.day);
          if (this.modelList.findIndex((_date) => _date.equals(xDate)) === -1)
            this.modelList.push(xDate);
        }

        this.range = false;
      }
    } else {
      if (this.modelList.findIndex((_date) => _date.equals(date)) >= 0) {
        this.modelList = this.modelList.filter(function (ele) {
          return !ele.equals(date);
        });
      } else {
        this.modelList.push(date);
      }
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return (
      (this.toDate && date.after(this.fromDate) && date.before(this.toDate)) ||
      this.modelList.findIndex((_date) => _date.equals(date)) >= 0
    );
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  calculateDiff(_dateSent: NgbDate, _currentDate: NgbDate) {
    let currentDate = new Date(
      Date.UTC(_currentDate.year, _currentDate.month - 1, _currentDate.day)
    );
    const dateSent = new Date(
      Date.UTC(_dateSent.year, _dateSent.month - 1, _dateSent.day)
    );

    return Math.floor(
      (Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ) -
        Date.UTC(
          dateSent.getFullYear(),
          dateSent.getMonth(),
          dateSent.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
  }

  onClickRange() {
    this.range = true;
    this.fromDate = null;
    this.toDate = null;
  }

  exists(date: NgbDate): boolean {
    return (
      this.modelList.findIndex((_date: NgbDate) => _date.equals(date)) >= 0
    );
  }
}
