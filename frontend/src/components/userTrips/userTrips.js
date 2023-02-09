import React, { useEffect, useState } from "react";
import NavBar from "../navBar/navBar";
import Trip from "../trip/trip";

const UserTrips = ({ navigate }) => {
  const [trips, setTrips] = useState([]);
  const [token] = useState(window.localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      fetch("/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          setTrips(data.trips);
        });
    } else {
      navigate("/");
    }
  }, []);

  const logout = () => {
    window.localStorage.removeItem("token");
  };

  return (
    <>
      <nav className="sticky z-50">
        <NavBar logout={logout} />
      </nav>
      <main id="main-container">
        <div className="h-28"></div>
        <div
          data-cy="trips"
          className="grid grid-cols-1 gap-8 content-start w-1/2 mx-auto z-30"
        >
          {trips
            .map((trip) => (
              <Trip trip={trip} token={token} setTrips={setTrips} />
            ))
            .reverse()}
        </div>
      </main>
    </>
  );
};

export default UserTrips;
