
import { Outlet } from "react-router";
import "./App.css";

function App() {
  return (
    <>
      <Outlet />
    </>
  );
}

// import LoginPage from "./Pages/Login";
// import SignupPage from "./Pages/SignUp";
// import ForgotPasswordPage from "./Pages/ForgotPassword";
// import { Route, Routes } from "react-router-dom";
// import NotFound from "./Pages/NotFound";
// import HomePage from "./Pages/HomePage";
// import ExplorePage from "./Pages/Explore";
// import ProtectedRoute from "./Routes/ProtectedRoute";
// import ManageTimetables from "./Pages/ManageTimetables";
// import ManageTeachingPlaces from "./Pages/ManageTeachingPlaces";
// import ManageStudents from "./Pages/ManageStudents";
// import ManageCourses from "./Pages/ManageCourses";
// import AddTeachingPlacePage from "./Pages/AddTeachingPlacePage";
// import UpdateTeachingPlacePage from "./Pages/UpdateTeachingPlacePage";
// import DeleteTeachingPlacePage from "./Pages/DeleteTeachingPlacePage";

// function App() {
//     return (
//         <Routes>
//             {/* home routes for admin */}
//             <Route
//                 path="/"
//                 element={
//                     // <ProtectedRoute allowedRoles={["Admin", "TeachingStaff", "Student"]}>
//                     <ProtectedRoute allowedRoles={["Admin"]}>
//                         <HomePage />
//                     </ProtectedRoute>
//                 }
//             >
//                 <Route path="explore" element={<ExplorePage />} />
//                 <Route path="manage-timetables" element={<ManageTimetables />} />
//                 <Route path="manage-places" element={<ManageTeachingPlaces />} />
//                 <Route path="manage-students" element={<ManageStudents />} />
//                 <Route path="manage-courses" element={<ManageCourses />} />
//             </Route>
//             {/* manage places routes */}
//             <Route
//                 path="/"
//                 element={
//                     <ProtectedRoute allowedRoles={["Admin"]}>
//                         <HomePage />
//                     </ProtectedRoute>
//                 }
//             >
//                 <Route path="manage-places/add" element={<AddTeachingPlacePage />} />
//                 <Route path="/manage-teaching-places/view" element={<AddTeachingPlacePage />} />
//                 <Route path="/manage-teaching-places/edit" element={<UpdateTeachingPlacePage />} />
//                 <Route path="/manage-teaching-places/schedules" element={<AddTeachingPlacePage />} />
//                 <Route path="/manage-teaching-places/delete" element={<DeleteTeachingPlacePage />} />
//             </Route>

//             {/* public routes */}
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/SignUp" element={<SignupPage />} />
//             <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//             <Route path="*" element={<NotFound />} />
//         </Routes>
//     );

// }

export default App;
