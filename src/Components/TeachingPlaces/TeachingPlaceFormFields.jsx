import React from "react";
import { TEACHING_PLACE_TYPES } from "../../Constants/teachingPlaces";

function TeachingPlaceFormFields({ formData, onChange, isLoading }) {
    return (
        <>
            {/* Name Input */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Place Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#7e57c2] focus:border-[#7e57c2] sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g. Ph-101"
                    disabled={isLoading}
                />
            </div>

            {/* Capacity Input */}
            <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Capacity <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={onChange}
                    required
                    min="0"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#7e57c2] focus:border-[#7e57c2] sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., 150"
                    disabled={isLoading}
                />
            </div>

            {/* Type Select */}
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Type <span className="text-red-500">*</span>
                </label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={onChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#7e57c2] focus:border-[#7e57c2] sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {TEACHING_PLACE_TYPES.map((placeType, index) => (
                        <option key={index} value={index}>
                            {placeType}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}

export default TeachingPlaceFormFields;
