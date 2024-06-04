import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { resetCart } from "../slices/cartSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const numItems = cartItems.reduce((a, c) => a + c.qty, 0);
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1">
        <Link to="/" className="text-xl">
          Proshop
        </Link>
      </div>
      <div className="flex flex-none">
        <label
          className="input input-bordered flex items-center gap-2"
          onClick={submitHandler}
        >
          <input
            type="text"
            className="grow text-black"
            placeholder="Search for keyword"
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
          />
          <FaSearch className="font-bold text-xl text-gray-600 cursor-pointer" />
        </label>
        <div className="dropdown dropdown-end ml-3">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <FaShoppingCart className="text-3xl" />
              <span className="badge badge-sm indicator-item">
                {cartItems.length > 0 ? numItems : 0}
              </span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="mt-3 z-[1] card card-compact dropdown-content w-48 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg text-black">
                {cartItems.length > 0 ? numItems : 0} Items
              </span>
              <span className="text-info">
                Subtotal: $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </span>
              <div className="card-actions">
                <Link to="/cart" className="btn btn-primary btn-block">
                  View cart
                </Link>
              </div>
            </div>
          </div>
        </div>
        {userInfo && userInfo.isAdmin ? (
          <div className="dropdown dropdown-hover btn-primary">
            <div tabIndex={0} role="button" className="btn m-1">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src="/avatar.png" />
                </div>
              </div>
              {userInfo.name}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36 text-gray-400"
            >
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/admin/userlist">Users</Link>
              </li>
              <li>
                <Link to="/admin/orderlist">Orders</Link>
              </li>
              <li>
                <Link to="/admin/productlist">Products</Link>
              </li>
              <li>
                <Link onClick={logoutHandler}>Logout</Link>
              </li>
            </ul>
          </div>
        ) : userInfo ? (
          <div className="dropdown dropdown-hover btn-primary">
            <div tabIndex={0} role="button" className="btn m-1">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src="/avatar.png" />
                </div>
              </div>
              {userInfo.name}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36 text-gray-400"
            >
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link onClick={logoutHandler}>Logout</Link>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <Link to="/login" className="flex items-center text-xl">
              <FaUser className="text-2xl mx-2" /> Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
