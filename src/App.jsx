import 'react-toastify/dist/ReactToastify.css';
import "./theme.css";
import './App.css'
import AppLayout from './Components/Layout/AppLayout'
import app from "./firebaseConfig";
import { createBrowserRouter, Route, RouterProvider, useSearchParams } from 'react-router-dom';
import { ErrorPage } from './Components/Pages/ErrorPage';
import BagModal from './Components/Pages/BagModal';
import PaymentPage from './Components/Pages/PaymentPage';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './Components/Layout/ProtectedRoute';
import FavouritePage from './Components/Pages/FavouriteModal';
import ProductDetails from './Components/Layout/ProductDetails';

import { useEffect, useState } from 'react';
import AdminDashboard from './Components/AdminLayout/AdminDashboard';
import ManageProducts from './Components/AdminLayout/ManageProducts';
import AdminRoute from './Components/AdminLayout/AdminRoute';
import AdminLayout from './Components/AdminLayout/AdminLayout';
import ManageOrders from './Components/AdminLayout/ManageOrders';
import ManageUsers from './Components/AdminLayout/ManageUsers';
import OrderConfirmation from './Components/Pages/OrderConfirmation';
import OrderDetails from './Components/AdminLayout/OrderDetails';
console.log("Firebase initiated", app)

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      // {
      //   path: "/",
      //   element: <Home />
      // },

      {
        path: "bag",
        element: <BagModal />
      },
      {
        path: "favourites",
        element: <FavouritePage />
      },
      {
        path: "/product/:id",
        element: <ProductDetails />
      },
      {
        path: "payment",
        element: (
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "order-confirmation",
        element: <OrderConfirmation />
      }

    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "",
        element: <AdminDashboard />
      },
      {
        path: "products",
        element: <ManageProducts />
      },
      {
        path: "orders",
        element: <ManageOrders />
      },
      {
        path: "users",
        element: <ManageUsers />
      },
      {
        path: "order/:orderId",
        element: <OrderDetails />
      }
    ],
  }
]);

const App = () => {

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };
  return (
    <>
      <header>
        <button onClick={toggleTheme}>
          SwitchTo {theme === 'light' ? 'dark' : 'light'} Mode
        </button>
      </header>
      <RouterProvider router={router}></RouterProvider>
      <ToastContainer position='top-right' autoClose={2000} />
    </>

  )
};
export default App;
