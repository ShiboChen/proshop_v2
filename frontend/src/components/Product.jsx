import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <div className="card w-64 bg-base-100 shadow-xl mb-6">
      <figure>
        <Link to={`/product/${product._id}`}>
          <img src={product.image} alt="product" />
        </Link>
      </figure>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <p className="fold-bold truncate">{product.name}</p>
        </Link>
        <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
        <p>${product.price}</p>
      </div>
    </div>
  );
};

export default Product;
