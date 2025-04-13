import React from "react";
import { FiPlusSquare, FiList, FiEdit, FiTrash2, FiCalendar } from "react-icons/fi";
import ActionBox from "../Components/TeachingPlaces/ActionBox";

const ManageTeachingPlaces = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Teaching Places</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ActionBox
                    to="/manage-places/add"
                    icon={FiPlusSquare}
                    title="Add New Place"
                    description="Create a new classroom, lab, or other teaching location."
                    iconColor="text-green-500"
                />

                <ActionBox
                    to="/manage-teaching-places/view"
                    icon={FiList}
                    title="View & Manage Places"
                    description="List, edit, delete, and manage schedules for existing teaching places."
                    iconColor="text-indigo-500"
                />

                <ActionBox
                    to="/manage-teaching-places/edit"
                    icon={FiEdit}
                    title="Update a Place"
                    description="Modify details of an existing place (requires selection)."
                    iconColor="text-yellow-500"
                    bgColor="bg-gray-50"
                />
                <ActionBox
                    to="/manage-teaching-places/schedules"
                    icon={FiCalendar}
                    title="Manage Schedules"
                    description="Add or view schedules for a specific place (requires selection)."
                    iconColor="text-purple-500"
                    bgColor="bg-gray-50"
                />
                <ActionBox
                    to="/manage-teaching-places/delete"
                    icon={FiTrash2}
                    title="Delete Places"
                    description="Remove teaching places (requires selection)."
                    iconColor="text-red-500"
                    bgColor="bg-gray-50"
                />
            </div>
        </div>
    );
};

export default ManageTeachingPlaces;
