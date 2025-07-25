import { Bounce, ToastContainer } from "react-toastify";

import { AuthProvider } from "@/services/auth";
import { ThemeProvider } from "@/services/theming";
import { FloatingBar } from "@/features/floating-bar";

import { Router } from "./routes";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router />

        <FloatingBar position="top-right" />

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
    </ThemeProvider>
  );
}

export default App;
