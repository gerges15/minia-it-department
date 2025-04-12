import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { TEACHING_PLACE_TYPES } from "../../Constants/teachingPlaces";

export default function TeachingPlacesListView({ places, onActionClick, actionType = "edit" }) {
    const isEdit = actionType === "edit";
    const ActionIcon = isEdit ? FiEdit : FiTrash2;
    const actionText = isEdit ? "Edit" : "Delete";

    const buttonBaseClasses =
        "inline-flex items-center px-3 py-1.5 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out";
    const buttonColorClasses = isEdit
        ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-100 focus:ring-[#7e57c2]"
        : "border-red-300 text-red-700 bg-white hover:bg-red-50 focus:ring-red-500";

    return (
        <>
            {places.length === 0 ? (
                <p className="text-center text-gray-500 mt-10 bg-white p-6 rounded-md shadow border border-gray-200">
                    No teaching places found. You might need to add some first.
                </p>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                    <ul role="list" className="divide-y divide-gray-200">
                        {places.map((place) => {
                            const ariaLabel = `${actionText} ${place.name}`;

                            return (
                                <li key={place.id}>
                                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className="text-base font-medium text-[#7e57c2] truncate"
                                                    title={place.name}
                                                >
                                                    {place.name}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Type:
                                                    <span className="font-medium">
                                                        {TEACHING_PLACE_TYPES[place.type] ?? "Unknown"}
                                                    </span>
                                                    <span className="mx-1">|</span>
                                                    Capacity: <span className="font-medium">{place.capacity}</span>
                                                </p>
                                            </div>
                                            <div className="ml-2 flex-shrink-0">
                                                <button
                                                    onClick={() => onActionClick(place)}
                                                    className={`${buttonBaseClasses} ${buttonColorClasses}`}
                                                    aria-label={ariaLabel}
                                                >
                                                    <ActionIcon className="h-4 w-4 md:mr-1.5" aria-hidden="true" />
                                                    <span className="hidden md:inline">{actionText}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </>
    );
}
