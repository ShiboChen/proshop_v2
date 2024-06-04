import React from "react";
import { Link } from "react-router-dom";
import Alert from "./Alert";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return (
    <>
      {isLoading ? null : error ? (
        <Alert type="3">{error?.data?.error || error.error}</Alert>
      ) : (
        <div className="my-4">
          <div className="carousel w-full bg-yellow-400">
            {products.map((item, idx) => (
              <div
                id={`slide${idx + 1}`}
                className="carousel-item relative w-full"
                key={item._id}
              >
                <Link to={`/product/${item._id}`}>
                  <img src={item.image} alt={item.name} className="max-h-96" />
                </Link>

                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <a
                    href={`#slide${idx === 0 ? products.length : idx}`}
                    className="btn btn-circle"
                  >
                    ❮
                  </a>
                  <a
                    href={`#slide${idx === products.length - 1 ? 1 : idx + 2}`}
                    className="btn btn-circle"
                  >
                    ❯
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center w-full py-2 gap-2">
            {products.map((_, idx) => (
              <a href={`#slide${idx + 1}`} className="btn btn-xs" key={idx}>
                {idx + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCarousel;
