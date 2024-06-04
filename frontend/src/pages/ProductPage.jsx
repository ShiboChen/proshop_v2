import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import Rating from "../components/Rating";
import Meta from "../components/Meta";
import { toast } from "react-toastify";
import { addToCart } from "../slices/cartSlice";

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: productId } = useParams();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (err) {
      toast.error(err?.data?.error || err.error);
    }
  };

  return (
    <div>
      <Link to="/" className="btn my-3">
        Go Back
      </Link>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert type="3"> {error?.data?.error || error.error}</Alert>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <div className="flex flex-wrap justify-between">
            <div className="card md:card-side bg-base-100 shadow-xl w-2/3">
              <figure>
                <img src={product.image} alt={product.name} />
              </figure>
              <div className="card-body md:w-1/2">
                <h2 className="card-title mb-4">{product.name}</h2>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
                <span className="py-2 border-y border-gray-500">
                  ${product.price}
                </span>
                <p>
                  <span className="font-bold text-black">Description:</span>{" "}
                  {product.description}
                </p>
              </div>
            </div>
            <div className="w-1/4 h-auto">
              <div className="w-full mr-8 p-4 border border-gray-600 rounded-md">
                <div className="flex">
                  <strong className="flex-1">Price:</strong>
                  <span className="flex-1">${product.price}</span>
                </div>
                <div className="flex py-4 my-4 border-y border-gray-400">
                  <strong className="flex-1">Status:</strong>
                  <span className="flex-1">
                    {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                  </span>
                </div>
                {product.countInStock > 0 && (
                  <div className="flex pb-4 border-b border-gray-400">
                    <span className="flex-1 font-medium">Quantity:</span>
                    <select
                      className="flex-1 h-8 border border-black rounded-md"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    className="btn btn-neutral"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2>Reviews</h2>
            {product.reviews.length === 0 && <Alert type="1">No Reviews</Alert>}
            <div>
              {product.reviews.map((review) => (
                <div key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>

            {userInfo ? (
              <form
                className="w-1/3 p-5 border-2 border-gray-200 rounded-md"
                onSubmit={submitHandler}
              >
                <h2>Write a Customer Review</h2>
                {loadingProductReview && <Spinner />}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Rating</span>
                  </label>
                  <select
                    className="input input-bordered"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Comment</span>
                  </label>
                  <input
                    type="textarea"
                    aria-rowspan={3}
                    className="input input-bordered"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control mt-6">
                  <button
                    className="btn btn-primary"
                    disabled={loadingProductReview}
                  >
                    Submit
                  </button>
                </div>
              </form>
            ) : (
              <Alert type="1">
                Please
                <Link to="/login" className="underline">
                  Sign In
                </Link>
                to write a review
              </Alert>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
