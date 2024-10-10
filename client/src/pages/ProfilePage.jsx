import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext.jsx";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage.jsx";
import AccountNav from "../AccountNav.jsx";

export default function ProfilePage() {
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  const [bookings, setBookings] = useState([]); // State to store bookings
  const { pathname } = useLocation();
  let subpage = pathname.split("/")?.[2];

  if (subpage === undefined) {
    subpage = "profile";
  }

  useEffect(() => {
    if (user) {
      // Fetch bookings when the user is logged in
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/bookings`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          setBookings(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch bookings:", error);
        });
    }
  }, [user]);

  async function logout() {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/logout`);
    setRedirect("/");
    setUser(null);
  }

  if (!ready) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl font-semibold text-gray-700">Loading...</span>
      </div>
    );
  }
  if (ready && !user && !redirect) {
    return <Navigate to={`${import.meta.env.VITE_API_BASE_URL}/login`} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="p-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 min-h-screen">
      <AccountNav />

      {subpage === "profile" && (
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg mx-auto mt-10 transform hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8YOzmJStPhmJ887s56zle7oTp393oPKbFsA&s"
                alt="User avatar"
                className="w-32 h-32 rounded-full shadow-lg border-4 border-indigo-500 object-cover"
              />
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500 animate-ping"></div>
            </div>
            <h2 className="text-4xl font-extrabold mb-2 text-gray-800 mt-4">
              Hello, {user.name}!
            </h2>
            <p className="text-gray-500 text-lg mb-6 italic">{user.email}</p>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition-transform duration-500 ease-in-out transform hover:translate-y-1 hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {subpage === "profile" && (
        <div className="mt-10 bg-white shadow-lg rounded-2xl p-6 max-w-lg mx-auto transition-transform duration-500 hover:scale-105">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Your Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="text-gray-800 font-medium">{user.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-800 font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Bookings:</span>
              <span className="text-gray-800 font-medium">
                {bookings.length} {bookings.length === 1 ? "Hotel" : "Hotels"}
              </span>
            </div>
          </div>
        </div>
      )}

      {subpage === "places" && (
        <div className="mt-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Your Booked Hotels
          </h2>
          <PlacesPage />
        </div>
      )}
    </div>
  );
}
