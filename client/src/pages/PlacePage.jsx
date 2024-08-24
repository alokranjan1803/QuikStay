import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/places/${id}`)
      .then((response) => {
        setPlace(response.data);
      });
  }, [id]);

  if (!place) return "";

  const renderExtraInfo = () => {
    const lines = place.extraInfo
      .split("\n")
      .filter((line) => line.trim() !== "");
    return (
      <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
        {lines.map((line, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {line}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          Check-in: {place.checkIn}
          <br />
          Check-out: {place.checkOut}
          <br />
          Max number of guests: {place.maxGuests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra Info / House Rules</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
          {renderExtraInfo()}
        </div>
      </div>
    </div>
  );
}
