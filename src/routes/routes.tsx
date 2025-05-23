import { createBrowserRouter } from "react-router";
// import ErrorBoundary from "./components/ErrorBoundary";
import AppLayout from "@/layout/app-layout";
import NotFound from "@/components/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Customchatbot from "@/pages/custom-chatbot";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    // errorElement: <ErrorBoundary />,
    children: [
      // {
      //   path: "/",
      //   element: <Home />,
      // },
      // {
      //   path: "chats",
      //   element: <Chats />,
      // },
      {
        path: "Customchatbot",
        element: <Customchatbot />,
      },
      // {
      //   path: "RequirementCapture",
      //   element: <RequirementCapture />,
      // },
      // {
      //   path: "DocumentGeneration",
      //   element: <DocumentGeneration />,
      // },
      // {
      //   path: "VideoPlayer",
      //   element: <VideoPlayer />,
      // },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
