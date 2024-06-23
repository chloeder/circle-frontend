import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import FollowPage from "./pages/FollowPage";
import ProfilePage from "./pages/ProfilePage";
import MainLayout from "./components/layouts/MainLayouts";
import DetailPage from "./pages/DetailPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import { Box, Spinner } from "@chakra-ui/react";

function App() {
  const { data: authUser, isPending } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/check-me");
        return res.data;
      } catch (error) {
        throw new Error("Unauthenticated");
      }
    },
  });

  if (isPending)
    return (
      <Box
        h="100vh"
        w="100vw"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="#00000"
      >
        <Spinner
          thickness="5px"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );

  const PrivateRoute = () => {
    return authUser ? <Outlet /> : <Navigate to={"/login"} />;
  };

  const AuthRoute = () => {
    return !authUser ? <Outlet /> : <Navigate to={"/"} />;
  };

  return (
    <>
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<MainLayout />}>
          <Route element={<PrivateRoute />}>
            <Route index element={<HomePage />} />
            <Route path="/thread/:id" element={<DetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/follow" element={<FollowPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<AuthRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
