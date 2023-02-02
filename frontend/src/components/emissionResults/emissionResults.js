const EmissionResults = ({ emissions, renderEmissions }) => {
  if (renderEmissions === true) {
    return (
      <>
        <div id="emissionResults" className="mt-2">
          <div>
            <div className="stats stats-vertical shadow">
              <div className="stat">
                <div className="stat-title">CO2e by Air</div>
                <div
                  data-cy="total-emissions-plane"
                  className="stat-value"
                >{`${emissions.plane.total.toFixed(1)} kg`}</div>
                <div
                  data-cy="person-emissions-plane"
                  className="stat-desc"
                >{`Per Person: ${emissions.plane.perPassenger.toFixed(
                  1
                )} kg`}</div>
              </div>

              <div className="stat">
                <div className="stat-title">CO2e by Car (Petrol)</div>
                <div
                  data-cy="total-emissions-petrolCar"
                  className="stat-value"
                >{`${emissions.petrolCar.total.toFixed(1)} kg`}</div>
                <div
                  data-cy="person-emissions-petrolCar"
                  className="stat-desc"
                >{`Per Person: ${emissions.petrolCar.perPassenger.toFixed(
                  1
                )} kg`}</div>
              </div>

              <div className="stat">
                <div className="stat-title">CO2e by Car (Electric)</div>
                <div
                  data-cy="total-emissions-electricCar"
                  className="stat-value"
                >{`${emissions.electricCar.total.toFixed(1)} kg`}</div>
                <div
                  data-cy="person-emissions-electricCar"
                  className="stat-desc"
                >{`Per Person: ${emissions.electricCar.perPassenger.toFixed(
                  1
                )} kg`}</div>
              </div>

              <div className="stat">
                <div className="stat-title">CO2e by Train</div>
                <div
                  data-cy="total-emissions-train"
                  className="stat-value"
                >{`${emissions.train.total.toFixed(1)} kg`}</div>
                <div
                  data-cy="person-emissions-train"
                  className="stat-desc"
                >{`Per Person: ${emissions.train.perPassenger.toFixed(
                  1
                )} kg`}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default EmissionResults;
