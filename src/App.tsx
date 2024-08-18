import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Login from "./Auth/Login";
import SignUp from "./Auth/Signup";

const router = createBrowserRouter([
  {
    path:"/",
    index: true,
    element: <Login />

  },
  {
    path:"/signup",
    element: <SignUp />
  }
])

export const App = () => {
  return (
      <RouterProvider router={router} />
  );
};