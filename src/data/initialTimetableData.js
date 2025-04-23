import { CLASS_TYPES, CLASS_COLORS } from '../constants/timetable';

const createInitialData = (year, semester, coursePrefix) => ({
  timetableData: {
    'Sunday-8:00 - 9:00': {
      course: `${coursePrefix}01`,
      instructor: 'Mohamed Ahmed',
      room: `H${year}03`,
      type: CLASS_TYPES.THEORY,
      color: CLASS_COLORS[CLASS_TYPES.THEORY],
    },
    'Sunday-9:00 - 10:00': {
      course: `${coursePrefix}02`,
      instructor: 'Moaz Ebrahim',
      room: `H${year}02`,
      type: CLASS_TYPES.THEORY,
      color: CLASS_COLORS[CLASS_TYPES.THEORY],
    },
    'Sunday-15:00 - 16:00': {
      course: `${coursePrefix}03`,
      instructor: 'David Nady',
      room: `H${year}03`,
      type: CLASS_TYPES.THEORY,
      color: CLASS_COLORS[CLASS_TYPES.THEORY],
    },
  },
  courses: Array.from({ length: 8 }, (_, i) => `${coursePrefix}0${i + 1}`),
  professors: [
    'Mohamed Ahmed', 'Moaz Ebrahim', 'David Nady', 'Girgis Samy',
    'Ahmed Hassan', 'Mostafa Mohamed', 'Youssef Ali'
  ],
});

export const initialYearData = {
  First: {
    First: createInitialData(1, 1, 'COMP1'),
    Second: createInitialData(1, 2, 'COMP11'),
  },
  Second: {
    First: createInitialData(2, 1, 'COMP2'),
    Second: createInitialData(2, 2, 'COMP21'),
  },
  Third: {
    First: createInitialData(3, 1, 'COMP3'),
    Second: createInitialData(3, 2, 'COMP31'),
  },
  Fourth: {
    First: createInitialData(4, 1, 'COMP4'),
    Second: createInitialData(4, 2, 'COMP41'),
  },
}; 