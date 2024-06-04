import React from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import Paginate from "../../components/Paginate";

const ProductListPage = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.error || err.error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div>
          <button className="btn" onClick={createProductHandler}>
            <FaPlus /> Create Product
          </button>
        </div>
      </div>
      {loadingCreate && <Spinner />}
      {loadingDelete && <Spinner />}
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert type="4">{error?.data?.error || error.error}</Alert>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="text-base font-bold text-black">
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <button className="btn btn-md mx-2">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        className="btn btn-md"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="my-4 text-center">
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          </div>
        </>
      )}
    </>
  );
};

export default ProductListPage;
