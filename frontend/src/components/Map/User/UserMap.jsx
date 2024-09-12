// src/components/MapComponent.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGetNearbyMechanicsQuery } from "../../../slices/usersApiSlice";

const UserMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchMechanics, setSearchMechanics] = useState(false);
  const { data: mechanicsData, refetch } = useGetNearbyMechanicsQuery(
    {
      latitude: userLocation?.lat,
      longitude: userLocation?.lng,
    },
    { skip: !searchMechanics }
  ); // Skip the query if searchMechanics is false

  useEffect(() => {
    // Request user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
        });
        console.log("User Location:", { latitude, longitude }); // Log latitude and longitude
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleSearch = () => {
    setSearchMechanics(true); // Set flag to true to trigger the search
    refetch(); // Refetch nearby mechanics
  };

  return (
    <div>
      <button onClick={handleSearch} style={{ margin: "10px" }}>
        Search Nearby Mechanics
      </button>
      <MapContainer
        center={userLocation || [0, 0]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {mechanicsData?.mechanics?.map((mechanic) => (
          <Marker
            key={mechanic._id}
            position={[
              mechanic.liveLocation.coordinates[1],
              mechanic.liveLocation.coordinates[0],
            ]}
          >
            <Popup>
              <div>
                <h4>{mechanic.name}</h4>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default UserMap;
