import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import CheckoutSteps from "../components/CheckoutSteps";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <div className="my-4 flex justify-center">
        <CheckoutSteps step1 step2 step3 step4 />
      </div>
      <div className="flex justify-between">
        <div className="w-2/3">
          <div className="mb-6">
            <h2 className="text-2xl my-4">Shipping Address</h2>
            <p>
              <strong>Address: </strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl my-4">Payment Method</h2>
            <strong>Method: </strong>
            {cart.paymentMethod}
          </div>
          <div>
            <h2 className="text-2xl my-4">Ordered Items</h2>
            {cart.cartItems.length === 0 ? (
              <Alert type="1">Your cart is empty </Alert>
            ) : (
              cart.cartItems.map((item) => (
                <div className="flex items-center mt-4" key={item._id}>
                  <div className="w-[15%]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-md"
                    />
                  </div>
                  <div
                    className={`w-[45%] ${
                      item.name.length > 45 ? "truncate" : ""
                    }`}
                  >
                    <Link to={`/product/${item._id}`} className="underline ">
                      {item.name}
                    </Link>
                  </div>
                  <div className="flex-grow ml-4 w-1/5">
                    {item.qty} x ${item.price} = $
                    {(item.qty * (item.price * 100)) / 100}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="w-1/4 h-auto my-4">
          <div className="w-full border border-gray-600 rounded-md p-3">
            <h2 className="text-2xl pb-4 border-b border-gray-400">
              Order Summary
            </h2>
            <div className="flex py-4 border-b border-gray-400">
              <strong className="flex-1">Subtotal:</strong>
              <span className="flex-1">${cart.itemsPrice}</span>
            </div>
            <div className="flex py-4 border-b border-gray-400">
              <strong className="flex-1">Shipping:</strong>
              <span className="flex-1">${cart.shippingPrice}</span>
            </div>
            <div>
              <div className="flex py-4 border-b border-gray-400">
                <strong className="flex-1">Tax:</strong>
                <span className="flex-1">${cart.taxPrice}</span>
              </div>
              <div className="flex py-4 border-b border-gray-400">
                <strong className="flex-1">Total:</strong>
                <span className="flex-1">${cart.totalPrice}</span>
              </div>
              {error && <Alert type="4">{error?.data?.error}</Alert>}
              <div className="mt-4">
                <button
                  className="btn btn-neutral"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </button>
                {isLoading && <Spinner />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
