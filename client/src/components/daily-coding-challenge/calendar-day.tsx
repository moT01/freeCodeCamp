import React from 'react';
import GreenPass from '../../assets/icons/green-pass';

interface CalendarDayProps {
  dayNumber: number;
  isComplete?: boolean;
  isAvailable?: boolean;
}

// so we need to have a list of days with challenges for the current month
// if daily challenge doesn't exist, display nothing
// if day is past today, display nothing

function CalendarDay({
  dayNumber,
  isComplete,
  isAvailable
}: CalendarDayProps): JSX.Element {
  return dayNumber === 0 ? (
    <div></div>
  ) : (
    <div className='calendar-day'>
      <span className='calendar-day-number'>{dayNumber}</span>
      {isComplete ? (
        <GreenPass />
      ) : isAvailable ? (
        <div className='empty-cirle' aria-label='Incomplete'></div>
      ) : null}
    </div>
  );
}

CalendarDay.displayName = 'CalendarDay';

export default CalendarDay;
