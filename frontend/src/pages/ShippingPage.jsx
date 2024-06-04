import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="my-6">
          <CheckoutSteps step1 step2 />
        </div>

        <form
          className="w-1/3 p-5 border-2 border-gray-200 rounded-md"
          onSubmit={submitHandler}
        >
          <h2 className="text-2xl mb-4 text-center">Shipping Address</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              placeholder="Address"
              className="input input-bordered"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">City</span>
            </label>
            <input
              type="text"
              placeholder="City"
              className="input input-bordered"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Postal Code</span>
            </label>
            <input
              type="text"
              placeholder="Postal Code"
              className="input input-bordered"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Country</span>
            </label>
            <input
              type="text"
              placeholder="Country"
              className="input input-bordered"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ShippingPage;
