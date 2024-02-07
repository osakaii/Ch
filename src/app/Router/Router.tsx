import Root from "app/Root";
import Home from "pages/Home/Home";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />} path="/">
      <Route element={<Home />} path="/" />
    </Route>,
  ),
);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
