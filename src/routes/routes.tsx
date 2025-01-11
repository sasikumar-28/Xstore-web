import { createBrowserRouter } from "react-router";
// import ErrorBoundary from "./components/ErrorBoundary";
import AppLayout from "@/layout/app-layout";
import NotFound from "@/components/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Chats from "@/pages/chats";
import Home from "@/pages/home";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    // errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "chats",
        element: <Chats />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
