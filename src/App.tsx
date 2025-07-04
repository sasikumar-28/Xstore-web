import "./App.css";
import { RouterProvider } from "react-router";
import routes from "./routes/routes";
import { Toaster } from "@/components/ui/toaster";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={routes} />
      <Toaster />
    </Provider>
  );
}

export default App;
