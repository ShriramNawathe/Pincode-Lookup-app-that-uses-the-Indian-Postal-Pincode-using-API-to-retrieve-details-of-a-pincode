import React, { useState } from "react";
import "./Apiendpoint.css";

const Apiendpoint = () => {
  const [pin, setPin] = useState("");
  const [pData, setPData] = useState([]);
  const [fData, setFData] = useState([]);
  const [filter, setFilter] = useState("");
  const [waitingL, setwaitingL] = useState(false);
  const [error, setError] = useState("");

  const hCNG = (event) => {
    setPin(event.target.value);
  };

  const hFcng = (event) => {
    setFilter(event.target.value);
    hF();
  };

  const hSub = async (event) => {
    event.preventDefault();
    setError("");

    if (pin.length !== 6) {
      setError("Pincode should be 6 digits.");
      return;
    }

    setwaitingL(true);

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pin}`
      );
      const data = await response.json();
      console.log(data);

      if (data[0].Status === "Error") {
        setError(data[0].Message);
        setwaitingL(false);
        return;
      }

      setPData(data[0].PostOffice);
      setFData(data[0].PostOffice);
      setwaitingL(false);
      document.getElementById("pF").classList.add("hide");
    } catch (error) {
      setError("Error fetching postal data.");
      setwaitingL(false);
    }
  };

  const hF = () => {
    const filtered = pData.filter((data) =>
      data.Name.toLowerCase().includes(filter.toLowerCase())
    );
    setFData(filtered);
  };

  return (
    <div className="k">
      <form onSubmit={hSub} className="pf" id="pF">
        <label className="box" for="text">
         <strong className="bor">Enter Pincode:</strong> 
        </label>
        <input className="box" placeholder="Pincode" type="text" value={pin} onChange={hCNG} />
        <button className="box" type="submit"> Search </button>
      </form>
      {waitingL && <div>wait for some time...</div>}
      {error && <div>{error}</div>}
      {pData.length > 0 && (
        <div>
          <div className="t">
            <div className="box">
               <strong>Pincode: {pin}</strong> 
            </div>
            <div className="box">
               <strong> Message :</strong> Number of pincode(s) found : <strong>{pData.length}</strong>
            </div>
            <input className="box" type="text" placeholder="Filter" value={filter} onChange={hFcng} />
            {/* <button className="ele" onClick={hF}>Filter</button> */}
          </div>
          {fData.length > 0 ? (
            <div className="container">
              {fData.map((data) => (
                <div key={data.Name} className="item">
                  <div>Name: {data.Name}</div>
                  <div>Branch Type: {data.BranchType}</div>
                  <div>Delivery Status: {data.DeliveryStatus}</div>
                  <div>District: {data.District}</div>
                  <div>Division: {data.Division}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>Couldn’t find the postal data you’re looking for…</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Apiendpoint;