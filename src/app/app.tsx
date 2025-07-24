import { Bounce, ToastContainer } from "react-toastify";

import { AuthProvider } from "@/services/auth";

import { Router } from "./routes";

function App() {
  return (
    <AuthProvider>
      <Router />

      <ToastContainer
        position="top-right"
        transition={Bounce}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover
        closeOnClick
        draggable
        rtl={false}
      />
    </AuthProvider>
  );
}

export default App;
