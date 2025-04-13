import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { addTeachingPlace } from "../../API/endpoints";
import SuccessMessage from "../Components/Common/SuccessMessage";
import ErrorMessage from "../Components/Common/ErrorMessage";
import SubmitButton from "../Components/TeachingPlaces/SubmitButton";
import TeachingPlaceFormFields from "../Components/TeachingPlaces/TeachingPlaceFormFields";

function AddTeachingPlacePage() {
    const [formData, setFormData] = useState({ name: "", capacity: "", type: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const numericCapacity = parseInt(formData.capacity, 10);
        const newPlaceData = {
            name: formData.name.trim(),
            capacity: numericCapacity,
            type: parseInt(formData.type, 10),
        };

        try {
            const response = await addTeachingPlace(newPlaceData);
            setSuccessMessage(`Teaching place "${response.data.name}" added successfully!`);
            setFormData({ name: "", capacity: "", type: 0 });
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
                <TeachingPlaceFormFields formData={formData} onChange={handleInputChange} isLoading={isLoading} />

                {error && <ErrorMessage error={error} />}

                {successMessage && <SuccessMessage successMessage={successMessage} />}

                <div className="pt-2">
                    <SubmitButton isLoading={isLoading} icon={<FiPlus />}>
                        Add Teaching Place
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

export default AddTeachingPlacePage;
