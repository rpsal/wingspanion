import AppRouter from "./Router";
import { AppProvider } from "./AppContext";

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
