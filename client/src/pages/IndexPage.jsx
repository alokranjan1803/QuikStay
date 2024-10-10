import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/places`)
      .then((response) => {
        setPlaces(response.data);
      });
  }, []);

  return (
    <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {places.length > 0 &&
        places.map((place) => (
          <Link key={place._id} to={"/place/" + place._id} className="group">
            <div className="bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform group-hover:scale-105 group-hover:shadow-xl">
              {place.photos?.[0] && (
                <div className="h-48 w-full overflow-hidden">
                  <Image
                    className="w-full h-full object-cover transition-transform transform group-hover:scale-110"
                    src={place.photos?.[0]}
                    alt={place.title}
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-900 truncate">
                  {place.title}
                </h2>
                <h3 className="text-sm text-gray-500 truncate">
                  {place.address}
                </h3>
                <div className="mt-2">
                  <span className="text-gray-900 font-bold">
                    ₹{place.price}
                  </span>{" "}
                  <span className="text-gray-500">per night</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
