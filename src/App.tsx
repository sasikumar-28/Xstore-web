import "./App.css";
import { RouterProvider } from "react-router";
import routes from "./routes/routes";
import { Toaster } from "@/components/ui/toaster"


function App() {
  return (
    <>
      <RouterProvider router={routes} />
      <Toaster />
    </>
  );
}

export default App;
