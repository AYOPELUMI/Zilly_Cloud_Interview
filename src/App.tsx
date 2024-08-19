import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Login from "./Auth/Login";
import SignUp from "./Auth/Signup";
import { Dashboard, DashboardLoader } from "./Dashboard/dashboard";

const router = createBrowserRouter([
  {
    path:"/",
    index: true,
    element: <Login />

  },
  {
    path:"/signup",
    element: <SignUp />
  },
  {
    path:"/dashboard",
    element: <Dashboard />,
    loader: DashboardLoader
  }
])

export const App = () => {
  return (
      <RouterProvider router={router} />
  );
};