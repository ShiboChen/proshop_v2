import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import { useRegisterMutation } from "../slices/usersApiSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== repeatPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const response = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...response }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.error || err.error);
      }
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
            <h2 className="text-2xl mb-4 text-center">Sign Up</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Repeat Password</span>
              </label>
              <input
                type="password"
                placeholder="Repeat Password"
                className="input input-bordered"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
              <label className="label">
                Already has an account?
                <Link
                  to={redirect ? `/login?redirect=${redirect}` : "/login"}
                  className="label-text-alt link link-hover text-base underline"
                >
                  Login
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" disabled={isLoading}>
                Register
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default RegisterPage;
