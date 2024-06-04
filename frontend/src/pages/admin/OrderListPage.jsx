import React from "react";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const OrderListPage = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  return (
    <div>
      <h1 className="text-2xl font-bold my-4">Orders</h1>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert type="4">{error?.data?.error || error.error}</Alert>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes className="text-red-400" />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes className="text-red-400" />
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      <button className="btn btn-ghost btn-sm">details</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
