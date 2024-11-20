import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// router
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
// store
import { Provider, useDispatch, useSelector } from "react-redux";
// reducer
import { store } from "./store";
import { setAuthState } from "./store/authSlice";

// Import your components
const Google = React.lazy(() => import("./views/dashboard/maps/google"));
const Default = React.lazy(() => import("./layouts/dashboard/default"));
const UserList = React.lazy(() => import("./views/dashboard/app/user-list"));
const PatrolList = React.lazy(() => import("./views/dashboard/app/patrol-list"));
const BoatList = React.lazy(() => import("./views/dashboard/app/boat-list"));
const Recoverpw = React.lazy(() => import("./views/dashboard/auth/recoverpw"));
const Resetpwd = React.lazy(() => import("./views/dashboard/auth/resetpwd"));
const Error404 = React.lazy(() => import("./views/dashboard/errors/error404"));
const SignIn = React.lazy(() => import("./views/dashboard/auth/sign-in"));
const Dashboard = React.lazy(() => import("./views/dashboard/dashboard"));
const EnclosedMissionsHistory = React.lazy(() => import("./views/dashboard/app/enclosed-missions-history")); // Enclosed Missions History

const PrivateRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(setAuthState({ isAuthenticated: true, token: storedToken }));
    }
  }, [dispatch]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/auth/sign-in" />;
};

const router = createBrowserRouter([
  {
    path: "*",
    element: <Error404 />
  },
  {
    path: '/',
    element: <Default />,
    children: [
      {
        path: '',
        element: <Google />
      },
      {
        path: 'user-list',
        element: <UserList />
      },
      {
        path: 'patrol-list',
        element: <PatrolList />
      },
      {
        path: 'boat-list',
        element: <BoatList />
      },
      {
        path: 'dashboard',
        element: <PrivateRoute element={<Dashboard />} />
      },
      {
        path: 'enclosed-missions-history',
        element: <PrivateRoute element={<EnclosedMissionsHistory />} /> // Enclosed Missions History page
      }
    ]
  },
  {
    path: 'auth/sign-in',
    element: <SignIn />
  },
  {
    path: 'auth/reset-password',
    element: <Recoverpw />
  },
  {
    path: 'reset-password',
    element: <Resetpwd />
  }
], { basename: process.env.PUBLIC_URL });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <Suspense fallback={<h1>Loading...</h1>}>
          <RouterProvider router={router}></RouterProvider>
        </Suspense>
      </App>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
