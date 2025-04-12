// routes/HomeRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ExplorePage from "../Pages/Explore";
import ManageTimetables from "../Pages/ManageTimetables";
import ManageTeachingPlaces from "../Pages/ManageTeachingPlaces";
import ManageStudents from "../Pages/ManageStudents";
import ManageCourses from "../Pages/ManageCourses";

function HomeRoutes() {
    return (
        <Routes>
            <Route path="explore" element={<ExplorePage />} />
            <Route path="manage-timetables" element={<ManageTimetables />} />
            <Route path="manage-places" element={<ManageTeachingPlaces />} />
            <Route path="manage-students" element={<ManageStudents />} />
            <Route path="manage-courses" element={<ManageCourses />} />
        </Routes>
    );
}

export default HomeRoutes;
