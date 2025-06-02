import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiX, FiClock, FiCalendar } from 'react-icons/fi';

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

const ScheduleViewModal = ({
  isOpen,
  onClose,
  place,
  schedules,
  isLoading,
}) => {
  const formatTime = hour => {
    return `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`;
  };

  const isSlotScheduled = (day, hour) => {
    return schedules.some(
      schedule =>
        schedule.day === DAYS.indexOf(day) &&
        schedule.startFrom <= hour &&
        schedule.endTo > hour
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl sm:max-w-5xl md:max-w-6xl transform overflow-hidden rounded-2xl bg-white p-3 sm:p-4 md:p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between mb-4 sm:mb-6"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <FiCalendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    <h3 className="text-base sm:text-lg md:text-xl font-medium leading-6 text-gray-900">
                      Schedule for {place?.name}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                  >
                    <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </Dialog.Title>

                {isLoading ? (
                  <div className="flex justify-center items-center h-48 sm:h-64">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="mt-2 sm:mt-4">
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                      <div className="min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="sticky left-0 z-10 px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 sm:w-24 bg-gray-50">
                                  Time
                                </th>
                                {DAYS.map(day => (
                                  <th
                                    key={day}
                                    className="px-3 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200"
                                  >
                                    {day}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {HOURS.map(hour => (
                                <tr key={hour}>
                                  <td className="sticky left-0 z-10 px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 font-medium bg-white border-r border-gray-200">
                                    {formatTime(hour)}
                                  </td>
                                  {DAYS.map(day => {
                                    const schedule = schedules.find(
                                      s =>
                                        s.day === DAYS.indexOf(day) &&
                                        s.startFrom === hour
                                    );
                                    const covered = schedules.some(
                                      s =>
                                        s.day === DAYS.indexOf(day) &&
                                        s.startFrom < hour &&
                                        s.endTo > hour
                                    );

                                    if (schedule) {
                                      const rowSpan =
                                        schedule.endTo - schedule.startFrom;
                                      return (
                                        <td
                                          key={`${day}-${hour}`}
                                          rowSpan={rowSpan}
                                          className="relative p-0 border-l border-gray-200 align-top h-full"
                                          style={{
                                            minWidth: 100,
                                            height: `${rowSpan * 40}px`,
                                            padding: 0,
                                          }}
                                        >
                                          <div
                                            className="h-full w-full flex flex-col items-center justify-center bg-blue-100 border border-blue-300 rounded-lg p-1 sm:p-2 text-xs text-blue-900 shadow-sm min-h-0"
                                            style={{ height: '100%' }}
                                          >
                                            <span className="font-semibold text-xs sm:text-sm">
                                              {formatTime(schedule.startFrom)} -{' '}
                                              {formatTime(schedule.endTo)}
                                            </span>
                                            {schedule.location && (
                                              <span className="flex items-center mt-1 text-blue-800 text-xs">
                                                {schedule.location}
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                      );
                                    } else if (covered) {
                                      return null;
                                    } else {
                                      return (
                                        <td
                                          key={`${day}-${hour}`}
                                          className="px-1 sm:px-2 py-1 border-l border-gray-200 bg-gray-50"
                                          style={{ minWidth: 100 }}
                                        >
                                          {/* Empty slot */}
                                        </td>
                                      );
                                    }
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {schedules.length === 0 && (
                      <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                        <FiClock className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" />
                        <p className="mt-2 text-xs sm:text-sm text-gray-500">
                          No schedules found for this place.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ScheduleViewModal;
