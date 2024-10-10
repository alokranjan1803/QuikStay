import { Link, useParams } from "react-router-dom";
import PlacesFormPage from "./PlacesFormPage.jsx";
import AccountNav from "../AccountNav.jsx";
import { useEffect, useState } from "react";
import PlaceImg from "../PlaceImg";
import axios from "axios";

export default function PlacesPage() {
  const { action } = useParams();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/user-places`)
      .then(({ data }) => {
        setPlaces(data);
      });
  }, []);

  return (
    <div>
      <AccountNav />

      <div className="text-center">
        <Link
          className="bg-primary text-white py-2 px-6 rounded-full inline-flex gap-1 items-center hover:bg-primary-dark transition duration-200"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Add new place
        </Link>
      </div>

      <div className="mt-8 space-y-5">
        {places.length > 0 &&
          places.map((place) => (
            <Link
              key={place._id}
              to={"/account/places/" + place._id}
              className="block bg-gray-50 shadow-md hover:shadow-lg rounded-xl transition duration-300 ease-in-out transform hover:scale-105 p-4 hover:bg-gray-200"
            >
              <div className="flex gap-4">
                <div className="flex w-40 h-40 grow shrink-0 ">
                  <PlaceImg className="rounded-xl" place={place} />
                </div>

                <div className="flex flex-col justify-evenly">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">
                    {place.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {place.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
