import React, { useEffect, useState, useCallback } from 'react';
import { deleteTeachingPlace, getTeachingPlaces } from '../services/endpoints';
import TeachingPlacesListView from '../components/TeachingPlaces/TeachingPlacesListView';
import ErrorMessage from '../components/Common/ErrorMessage';
import SuccessMessage from '../components/Common/SuccessMessage';
import Spinner from '../components/Common/Spinner';

export default function DeleteTeachingPlacePage() {
  const [places, setPlaces] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  const fetchPlaces = useCallback(async () => {
    setFetchLoading(true);
    setFetchError(null);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      const response = await getTeachingPlaces();
      setPlaces(response.data || []);
    } catch (err) {
      console.error('Failed to fetch teaching places:', err);
      const detail = err.response?.data?.detail;
      setFetchError(detail);
      setPlaces([]);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleDeleteClick = place => {
    performDelete(place);
    setDeleteError(null);
    setDeleteSuccess(null);
  };

  const performDelete = async place => {
    if (!place) return;

    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      await deleteTeachingPlace(place.id);
      setDeleteSuccess(`Teaching place "${place.name}" deleted successfully.`);
      setPlaces(currentPlaces => currentPlaces.filter(p => p.id !== place.id));
      // setTimeout(() => setDeleteSuccess(null), 8000);
    } catch (err) {
      console.error('API Delete Error:', err);
      const detail = err.response?.data?.detail;
      setDeleteError(
        typeof detail === 'string'
          ? detail
          : `Failed to delete "${place.name}". Please try again.`
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
        <span className="ml-3 text-gray-600">Loading teaching places...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-4">
        <ErrorMessage error={fetchError} onClose={() => setFetchError(null)} />
        <button
          onClick={fetchPlaces}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7e57c2]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-8 px-4 sm:px-0">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Delete Teaching Place
      </h1>

      <TeachingPlacesListView
        places={places}
        onActionClick={handleDeleteClick}
        actionType="delete"
      />

      {deleteSuccess && (
        <SuccessMessage
          successMessage={deleteSuccess}
          onClose={() => setDeleteSuccess(null)}
        />
      )}
      {deleteError && (
        <ErrorMessage
          error={deleteError}
          onClose={() => setDeleteError(null)}
        />
      )}

      {deleteLoading && (
        <div className="flex justify-center items-center my-4">
          <Spinner size="small" />
          <span className="ml-2 text-sm text-gray-500">Deleting place...</span>
        </div>
      )}
    </div>
  );
}
