import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGetNearbyMechanicsQuery } from "../../../slices/usersApiSlice";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setMechanicsData,
  clearMechanicsData,
} from "../../../slices/mechanicSlice"; // Ensure correct path

const UserMap = () => {
  const [userLocation, setUserLocation] = useState({
    lat: 5.772598115563803, // Example latitude
    lng: 0.0468934723269605, // Example longitude
  });
  const [searchMechanics, setSearchMechanics] = useState(false);

  const dispatch = useDispatch();
  const mechanicsData = useSelector((state) => state.mechanics.data);

  const {
    data: fetchedMechanicsData,
    refetch,
    isFetching,
  } = useGetNearbyMechanicsQuery(
    {
      latitude: userLocation?.lat,
      longitude: userLocation?.lng,
    },
    { skip: !searchMechanics }
  );

  const handleSearch = () => {
    if (!searchMechanics) {
      setSearchMechanics(true);
    } else if (!isFetching) {
      refetch();
    }

    // After the fetch is completed, store data in Redux
    if (fetchedMechanicsData) {
      dispatch(setMechanicsData(fetchedMechanicsData)); // Store fetched data in Redux
    }

      
  };

  const handleClear = () => {
    dispatch(clearMechanicsData()); // Clear mechanics data from Redux
  };

  const { userInfo } = useSelector((state) => state.auth);
  const makerImageUrl = userInfo?.profilePicture;

  const createIcon = (imageUrl) =>
    L.icon({
      iconUrl: imageUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: "round-icon",
    });

  return (
    <div>
      {/* Loading Overlay */}
      {isFetching && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
        </div>
      )}

      <button onClick={handleSearch} style={{ margin: "10px" }}>
        Search Nearby Mechanics
      </button>

      <button onClick={handleClear} style={{ margin: "10px" }}>
        Clear Mechanics
      </button>

      <MapContainer
        center={userLocation || [0, 0]}
        zoom={13}
        style={{ height: "70vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createIcon(makerImageUrl)}
          >
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
            icon={createIcon(mechanic?.mechanicDetails?.mechanicProfilePicture)}
          >
            <Popup>
              <div>
                <Link to={`/mechanic/${mechanic._id}`}>
                  <h4>View {mechanic.name}</h4>
                </Link>
                <p>Specialty: {mechanic.mechanicDetails.specialty}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// CSS styles for the loading overlay and spinner
const styles = {
  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background with reduced opacity
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Make sure the overlay is on top
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "6px solid #ccc", // Lighter grey for the spinner
    borderTop: "6px solid #333", // Darker grey for the top part
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default UserMap;
