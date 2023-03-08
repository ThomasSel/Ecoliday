import PropTypes from "prop-types";

const Trip = ({ trip, token, setTrips }) => {
  Trip.propTypes = {
    trip: PropTypes.object,
    token: PropTypes.string,
    setTrips: PropTypes.func,
  };

  const unpackEmissions = (trip, type) => {
    if (type === "Total") {
      return [
        { result: trip.emissions.plane.total },
        { result: trip.emissions.petrolCar.total },
        { result: trip.emissions.electricCar.total },
        { result: trip.emissions.train.total },
      ];
    } else {
      return [
        { result: trip.emissions.plane.perPassenger },
        { result: trip.emissions.petrolCar.perPassenger },
        { result: trip.emissions.electricCar.perPassenger },
        { result: trip.emissions.train.perPassenger },
      ];
    }
  };

  const formatEmissions = (trip, type) => {
    return (
      <>
        <tr className="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0">
          <td className="p-3 text-lg uppercase text-green-900">{type}</td>
          {unpackEmissions(trip, type).map((emissions) => (
            <td className="hover:text-xl hover:text-green-900 text-lg text-left pl-3 pr-3">
              {emissions.result ? `${emissions.result.toFixed(1)}` : "N/A"}
            </td>
          ))}
        </tr>
      </>
    );
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const response = await fetch("/trips", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        trip_id: trip._id,
      },
    });

    if (response.status !== 200) {
      console.log("trip NOT deleted");
    } else {
      console.log("trip deleted");

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
      }
    }
  };

  return (
    <>
      <div className="bg-white bg-opacity-20 p-4 rounded-lg last:mb-10">
        <div data-cy="trip" className="bg-white bg-opacity-75 p-7 rounded-lg">
          <span className="text-green-900 font-bold mr-2 mix-blend-darken">
            From:
          </span>

          <span className="text-gray-600 font-medium">{trip.from}</span>
          <span className="text-green-900 font-bold mr-2">
            <br></br>
            To:
          </span>
          <span className="text-gray-600 font-medium">{trip.to}</span>
          <span className="text-green-900 font-bold mr-2">
            <br></br>
            Passengers:
          </span>
          <span className="text-gray-600 font-medium mb-2">
            {trip.passengers}
          </span>
          <div className="mb-2"></div>

          <div className="container">
            <div className="w-full flex flex-row flex-no-wrap rounded-lg overflow-hidden sm:shadow-lg my-5">
              <table className="w-full text-sm text-left bg-white bg-opacity-40  text-gray-500 dark:text-gray-400">
                <thead className="text-xl text-green-900 uppercase dark:bg-gray-700 dark:text-gray-400">
                  <tr className="flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0">
                    <th class="p-5 text-left">CO2e(kg)</th>
                    <th>
                      <span className="material-symbols-outlined ml-6">
                        flight_takeoff
                      </span>
                    </th>
                    <th>
                      <span className="material-symbols-outlined ml-6">
                        directions_car
                      </span>
                    </th>
                    <th>
                      <span className="material-symbols-outlined ml-6">
                        electric_car
                      </span>
                    </th>
                    <th>
                      <span className="material-symbols-outlined ml-6">
                        train
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="flex-1 sm:flex-none">
                  {formatEmissions(trip, "Total")}
                  {formatEmissions(trip, "Per Person")}
                </tbody>
              </table>
            </div>
            <form onSubmit={handleDelete}>
              <input
                data-cy="deleteButton"
                type="submit"
                value="Delete"
                className="btn bg-green-900 border-0 hover:bg-green-700 rounded-full"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Trip;
