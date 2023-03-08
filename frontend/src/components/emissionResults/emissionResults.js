import React, { useState } from "react";

const EmissionResults = ({
  emissions,
  renderEmissions,
  fromDisplay,
  toDisplay,
  passengers,
  setSaveToggle,
  saveToggle,
  loading,
}) => {
  const [token] = useState(window.localStorage.getItem("token"));

  const saveButtonView = token !== null;

  const CO2eBurger = 2.5;
  const CO2eTshirt = 7;
  const CO2eTree = 25;

  const emissionStats = () => {
    const resultsArray = [
      {
        type: "plane",
        logo: (
          <>
            <span class="material-symbols-outlined">flight_takeoff</span>
          </>
        ),
        emissions: emissions.plane,
      },
      {
        type: "petrol car",
        logo: (
          <>
            <span class="material-symbols-outlined">directions_car</span>
          </>
        ),
        emissions: emissions.petrolCar,
      },
      {
        type: "electric car",
        logo: (
          <>
            <span class="material-symbols-outlined">electric_car</span>
          </>
        ),
        emissions: emissions.electricCar,
      },
      {
        type: "train",
        logo: (
          <>
            <span class="material-symbols-outlined">train</span>
          </>
        ),
        emissions: emissions.train,
      },
    ];

    return (
      <>
        <div className="w-40"></div>
        <div className="bg-white bg-opacity-20 p-4 rounded-lg ml-10">
          <div className="bg-white bg-opacity-75 p-7 rounded-lg">
            <span className="text-green-900 font-bold mr-2 mix-blend-darken">
              From:
            </span>

            <span className="text-gray-600 font-medium">{fromDisplay}</span>
            <span className="text-green-900 font-bold mr-2">
              <br></br>
              To:
            </span>
            <span className="text-gray-600 font-medium">{toDisplay}</span>
            <span className="text-green-900 font-bold mr-2">
              <br></br>
              Passengers:
            </span>
            <span className="text-gray-600 font-medium">{passengers}</span>
            <div className="container">
              <div className="w-full flex flex-row flex-no-wrap rounded-lg  sm:shadow-lg mt-1 mb-5">
                <table className="w-full text-sm text-center bg-white bg-opacity-40  text-gray-500 dark:text-gray-400">
                  <thead className="text-green-900 uppercase dark:bg-gray-700 dark:text-gray-400">
                    <tr className="flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none sm:mb-0">
                      <th class="p-5 ">Transport</th>
                      <th class="p-5 ">
                        Total <br />{" "}
                        <span className="normal-case">(kg C02e)</span>
                      </th>
                      <th class="p-5">
                        Passenger <br />{" "}
                        <span className="normal-case">(kg C02e)</span>
                      </th>
                      <th class="pr-16"></th>
                    </tr>
                  </thead>
                  <tbody className="flex-1 sm:flex-none text-center">
                    {resultsArray.map((result) => {
                      return (
                        <>
                          <tr
                            data-cy={`emissions-dropdown-${result.type}`}
                            className="hover"
                          >
                            <td>{result.logo}</td>
                            <td data-cy={`total-emissions-${result.type}`}>
                              {result.emissions.total
                                ? `${result.emissions.total.toFixed(1)}`
                                : "N/A"}
                            </td>
                            <td data-cy={`person-emissions-${result.type}`}>
                              {result.emissions.perPassenger
                                ? `${result.emissions.perPassenger.toFixed(1)}`
                                : "N/A"}
                            </td>
                            <td className="dropdown dropdown-hover dropdown-right h-full">
                              <span className="material-symbols-outlined text-center">
                                help
                              </span>
                              {emissionsContext(result)}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {saveButtonView && (
                <div className="relative h-10">
                  <form
                    onSubmit={handleSave}
                    className="absolute inset-y-0 right-0"
                  >
                    <input
                      data-cy="saveButton"
                      type="submit"
                      disabled={saveToggle}
                      value={saveToggle ? "SAVED" : "SAVE"}
                      className="btn bg-green-900 border-0 hover:bg-green-700 rounded-full"
                    />
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const emissionsContext = (result) => {
    if (result.emissions.total) {
      return (
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow-2xl ml-14 bg-opacity-70 bg-white rounded-box w-56 text-base text-gray-800 text-left"
        >
          Equivalent to...
          <li>
            <p>
            <span class="material-symbols-outlined">lunch_dining </span>
            {`Eating ${Math.ceil(result.emissions.total / CO2eBurger)} ${
              Math.ceil(result.emissions.total / CO2eBurger) === 1
                ? "burger"
                : "burgers"
            }`}
          </p></li>
          <li><p>
            <span class="material-symbols-outlined">laundry</span>
            {`Buying ${Math.ceil(result.emissions.total / CO2eTshirt)} ${
              Math.ceil(result.emissions.total / CO2eTshirt) === 1
                ? "T-shirt"
                : "T-shirts"
            }`}
          </p></li>
          <li><p>
            <span class="material-symbols-outlined">park</span>
            {`Saving ${Math.ceil(result.emissions.total / CO2eTree)} ${
              Math.ceil(result.emissions.total / CO2eTree) === 1
                ? "tree"
                : "trees"
            } a year`}
          </p></li>
        </ul>
      );
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    let response = await fetch("/trips", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        to: toDisplay,
        from: fromDisplay,
        passengers: passengers,
        emissions: emissions,
      }),
    });

    if (response.status !== 201) {
      console.log("trip NOT added");
    } else {
      setSaveToggle(true);
      console.log("trip added");
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex flex-col w-96 h-96 bg-white bg-opacity-75 justify-center items-center rounded-xl mt-24 ml-10">
          <div className="text-3xl">Loading...</div>
          <div>
            <span className="material-symbols-outlined animate-spin text-9xl">
              eco
            </span>
          </div>
        </div>
      </>
    );
  } else if (renderEmissions) {
    return (
      <>
        <div id="emissionResults" className="mt-20">
          <div>{emissionStats()}</div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export default EmissionResults;
