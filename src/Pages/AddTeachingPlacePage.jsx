import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { addTeachingPlace } from "../../API/endpoints";
import SuccessMessage from "..//Components/Common/SuccessMessage";
import Spinner from "../Components/Common/Spinner";
import ErrorMessage from "../Components/Common/ErrorMessage";
const TEACHING_PLACE_TYPES = ["Hall", "Lab", "Stadium"];

function AddTeachingPlacePage() {
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [type, setType] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const numericCapacity = parseInt(capacity, 10);
        const newPlaceData = {
            name: name.trim(),
            capacity: numericCapacity,
            type: parseInt(type, 10),
        };

        alert(newPlaceData.type);

        try {
            const response = await addTeachingPlace(newPlaceData);
            console.log(response);

            setSuccessMessage(`Teaching place "${response.data.name}" added successfully!`);

            // Reset form
            setName("");
            setCapacity("");
            setType(0);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to add teaching place. Please try again.");
            console.error("API Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 md:p-8 bg-white rounded-lg shadow-md border border-gray-200">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Add New Teaching Place</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Place Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g. Ph-101"
                        disabled={isLoading}
                    />
                </div>

                {/* Capacity Input */}
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="capacity"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        required
                        min="0"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., 150"
                        disabled={isLoading}
                    />
                </div>

                {/* Type Select */}
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        disabled={isLoading}
                    >
                        {TEACHING_PLACE_TYPES.map((placeType, index) => (
                            <option key={index} value={index}>
                                {placeType}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Error Message Display */}
                {error && <ErrorMessage error={error} />}

                {/* Success Message Display */}
                {successMessage && <SuccessMessage successMessage={successMessage} />}

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7e57c2] hover:bg-[#6a4aaa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            <>
                                <FiPlus className="h-5 w-5 mr-2" />
                                Add Teaching Place
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddTeachingPlacePage;
