import React, { useState, useEffect } from 'react';
import { getTeachingPlaces, updateTeachingPlace } from '../services/endpoints';
import Spinner from '../components/Common/Spinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import SuccessMessage from '../components/Common/SuccessMessage';
import { FiSave, FiXCircle, FiArrowLeft } from 'react-icons/fi';
import TeachingPlaceFormFields from '../components/TeachingPlaces/TeachingPlaceFormFields';
import SubmitButton from '../components/TeachingPlaces/SubmitButton';
import TeachingPlacesListView from '../components/TeachingPlaces/TeachingPlacesListView';

export default function UpdateTeachingPlacePage() {
  // States of list of places
  const [places, setPlaces] = useState([]);
  const [fetchLoading, setListLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // States of the selected place and its form data
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    capacity: '',
    type: 0,
  });
  const [formLoading, setFormLoading] = useState(false); // Loading state for fetching selected item details (if needed)

  // States of update operation feedback
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // --- Fetch the list of teaching places ---
  useEffect(() => {
    const fetchPlaces = async () => {
      setListLoading(true);
      setFetchError(null);
      try {
        const response = await getTeachingPlaces();
        setPlaces(response.data || []);
      } catch (err) {
        console.error('Failed to fetch teaching places:', err);
        const detail = err.response?.data?.detail;
        setFetchError(
          typeof detail === 'string'
            ? detail
            : 'Could not load teaching places. Please try again later.'
        );
      } finally {
        setListLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // --- Handle selecting a place to edit ---
  const handleSelectPlace = place => {
    setSelectedPlaceId(place.id);
    setUpdateError(null);
    setUpdateSuccess(null);

    setFormData({
      id: place.id,
      name: place.name,
      capacity: place.capacity.toString(),
      type: place.type,
    });
  };

  // --- Handle form input changes ---
  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- Handle form submission (Update) ---
  const handleUpdateSubmit = async event => {
    event.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    const numericCapacity = parseInt(formData.capacity, 10);
    const updatedData = {
      name: formData.name.trim(),
      capacity: numericCapacity,
      type: parseInt(formData.type, 10),
    };

    try {
      const response = await updateTeachingPlace(formData.id, updatedData);
      setUpdateSuccess(
        `Teaching place "${response.data.name || formData.name}" updated successfully!`
      );

      setPlaces(prevPlaces =>
        prevPlaces.map(p =>
          p.id === formData.id ? { ...p, ...response.data } : p
        )
      );
    } catch (err) {
      console.error('API Update Error:', err);
      const detail = err.response?.data?.detail;
      setUpdateError(
        typeof detail === 'string'
          ? detail
          : 'Failed to update teaching place. Please try again.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Handle Cancel / Back to List ---
  const handleCancel = () => {
    setSelectedPlaceId(null);
    setFormData({ id: null, name: '', capacity: '', type: 0 });
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="bg-red-900">
          <Spinner />
        </div>
        <span className="ml-2 text-gray-500">Loading teaching places...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-4">
        <ErrorMessage error={fetchError} />
      </div>
    );
  }

  if (selectedPlaceId) {
    return (
      <div className="max-w-2xl mx-auto mt-8 mb-8">
        {/* Back Button */}
        <button
          onClick={handleCancel}
          className="inline-flex items-center mb-4 text-sm text-gray-600 hover:text-gray-900 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
        >
          <FiArrowLeft className="h-4 w-4 mr-1" />
          Back to List
        </button>

        {/* Form Loading indicator (only if fetching details separately) */}
        {formLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size="h-8 w-8" />
          </div>
        ) : (
          <form
            onSubmit={handleUpdateSubmit}
            className="bg-white p-6 sm:p-8 border border-gray-200 rounded-lg shadow-md space-y-6"
          >
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
              Update Teaching Place:{' '}
              <span className="text-[#7e57c2]">{formData.name}</span>
            </h1>

            {/* Use the reusable form fields component */}
            <TeachingPlaceFormFields
              formData={formData}
              onChange={handleInputChange}
              isLoading={isUpdating}
            />

            {/* Update Operation Error/Success Messages */}
            <div className="min-h-[2rem] mt-1">
              {updateError && <ErrorMessage error={updateError} />}
            </div>
            <div className="min-h-[2rem] mt-1">
              {updateSuccess && (
                <SuccessMessage successMessage={updateSuccess} />
              )}
            </div>

            {/* Action Buttons: Cancel and Save */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiXCircle className="h-5 w-5 mr-2" />
                Cancel
              </button>
              <SubmitButton isLoading={isUpdating} icon={<FiSave />}>
                Save Changes
              </SubmitButton>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-8 px-4 sm:px-0">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Update Teaching Place
      </h1>
      <TeachingPlacesListView
        places={places}
        handleFunction={handleSelectPlace}
      />
    </div>
  );
}
