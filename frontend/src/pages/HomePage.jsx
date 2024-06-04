import React from "react";
import { Link, useParams } from "react-router-dom";
import Product from "../components/Product";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import Meta from "../components/Meta";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { useGetProductsQuery } from "../slices/productsApiSlice";

const HomePage = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn mb-4">
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert type="3">{error?.data?.message || error.error}</Alert>
      ) : (
        <>
          <Meta />
          <h1 className="text-3xl mb-12">New Products</h1>
          <div className="flex flex-wrap gap-12">
            {data.products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
          <div className="my-4 text-center">
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword ? keyword : ""}
            />
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
