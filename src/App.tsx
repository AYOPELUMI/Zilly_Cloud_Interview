import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Login from "./Auth/Login";

const router = createBrowserRouter([
  {
    path:"/",
    element: <Login />

  }
])

export const App = () => {
  return (
      <RouterProvider router={router} />
  );
};