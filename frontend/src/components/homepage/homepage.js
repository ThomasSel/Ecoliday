import React, { useState, useReducer } from "react";
import TravelForm from "../travelForm/TravelForm";
import EmissionResults from "../emissionResults/emissionResults";
import NavBar from "../navBar/navBar";

const HomePage = ({ navigate }) => {
  const [emissions, setEmissions] = useState("");
  const [renderEmissions, setRenderEmissions] = useState(false);
  const [toDisplay, setToDisplay] = useState("");
  const [fromDisplay, setFromDisplay] = useState("");
  const [passengers, setPassengers] = useState("");
  const [saveToggle, setSaveToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const hasToken = Boolean(window.localStorage.getItem("token"));

  const navbarLinks = () => {
    if (!hasToken) {
      return [{ href: "/login", text: "Login", handleClick: () => {} }];
    } else {
      return [
        {
          href: "/trips",
          text: "Trips",
          handleClick: () => {},
        },
        {
          href: "/",
          text: "Logout",
          handleClick: (e) => {
            e.preventDefault();
            window.localStorage.removeItem("token");
            forceUpdate();
          },
        },
      ];
    }
  };

  return (
    <>
      <main id="main-container">
        <nav>
          <NavBar links={navbarLinks()} />
        </nav>
        <div className="h-20"></div>

        <div className="flex justify-center">
          <TravelForm
            setEmissions={setEmissions}
            setRenderEmissions={setRenderEmissions}
            setToDisplay={setToDisplay}
            setFromDisplay={setFromDisplay}
            passengers={passengers}
            setPassengers={setPassengers}
            setSaveToggle={setSaveToggle}
            setLoading={setLoading}
          />

          <EmissionResults
            emissions={emissions}
            renderEmissions={renderEmissions}
            fromDisplay={fromDisplay}
            toDisplay={toDisplay}
            passengers={passengers}
            setSaveToggle={setSaveToggle}
            saveToggle={saveToggle}
            loading={loading}
          />
        </div>
      </main>
    </>
  );
};

export default HomePage;
