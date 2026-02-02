import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import ReportScammer from "./pages/ReportScammer";
import Statistics from "./pages/Statistics";
import VerifiedList from "./pages/VerifiedList";
import ScammersList from "./pages/ScammersList";
import FAQ from "./pages/FAQ";
import About from "./pages/About";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin-dashboard"} component={AdminDashboard} />
      <Route path={"/report"} component={ReportScammer} />
      <Route path={"/statistics"} component={Statistics} />
      <Route path={"/verified"} component={VerifiedList} />
      <Route path={"/scammers"} component={ScammersList} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/about"} component={About} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
