import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...response }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.error || err.error);
    }
  };

  return (
    <>
      {isLoading && <Spinner /> ? (
        ""
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <form
            className="w-1/3 p-5 border-2 border-gray-200 rounded-md"
            onSubmit={submitHandler}
          >
            <h2 className="text-2xl mb-4 text-center">Sign In</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="label">
                New Customer?
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="label-text-alt link link-hover text-base underline"
                >
                  Register
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" disabled={isLoading}>
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default LoginPage;
