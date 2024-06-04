import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import Alert from "../components/Alert";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="flex justify-between">
      <div className="w-2/3">
        <h2 className="text-2xl my-4">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <Alert type="1">
            Your cart is empty{" "}
            <Link to="/" className="underline">
              Go Back
            </Link>
          </Alert>
        ) : (
          cartItems.map((item) => (
            <div className="flex items-center mt-4" key={item._id}>
              <div className="w-[15%]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-md"
                />
              </div>
              <div
                className={`w-[45%] ${item.name.length > 45 ? "truncate" : ""}`}
              >
                <Link to={`/product/${item._id}`} className="underline ">
                  {item.name}
                </Link>
              </div>
              <div className="ml-4 w-[10%]">
                <span>${item.price}</span>
              </div>
              <div className="flex-grow ml-4 w-1/5">
                <select
                  className="border rounded-md p-1 w-full"
                  value={item.qty}
                  onChange={(e) =>
                    addToCartHandler(item, Number(e.target.value))
                  }
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/10 ml-4">
                <button
                  type="button"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="w-1/4 h-auto my-4">
        <div className="w-full border border-gray-900 rounded-md p-3">
          <p className="text-2xl">
            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
            items
          </p>
          <p className="py-3 mb-4 border-b border-gray-700">
            $
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
          </p>
          <div>
            <button
              className="btn btn-neutral"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
