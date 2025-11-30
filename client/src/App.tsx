import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignupPage from "./pages/SignupPage";
import OrganizationDetailsPage from "./pages/OrganizationDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import DonationFormCreatorPage from "./pages/DonationFormCreatorPage";
import DonationFormPreviewPage from "./pages/DonationFormPreviewPage";
import PaymentSetupPage from "./pages/PaymentSetupPage";
import AccountInfoPage from "./pages/AccountInfoPage";
import CampaignsPage from "./pages/CampaignsPage";
import TeamPage from "./pages/TeamPage";
import NotFound from "./pages/NotFound";
import DonationSuccessPage from "./pages/DonationSuccessPage";
import DonationCancel from "./pages/DonationCancel";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import CampaignNotFoundPage from "./pages/CampaignNotFound"
// import { useOrgAuth } from "./Authorization/useOrgAuth";
import { ProtectedRoute,GuestRoute} from "./Authorization/Wrapper";
import VerificationPendingPage from "./pages/VerificationPendingPage";
import { OrgProvider } from "./context/OrgContext";
import { DonationProvider } from "./hooks/DonationContext";
// import ProtectedRoute from "./Authorization/ProtectedRoute";
// import PublicRoute from "./Authorization/PublicRoute";

const queryClient = new QueryClient();

const App = () => {
  // const { loading, isOrgAuth } = useOrgAuth();
  

  // if (loading) return <div>Loading...</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <OrgProvider >
          <DonationProvider >
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            {/* the bellow urlshould be protected */}
            <Route path="/campaigns/:id" element={<CampaignsPage />} />  
            
            <Route path="/donation-success" element={<DonationSuccessPage />} />
            <Route path="/donation-cancel" element={<DonationCancel />} />
            <Route path="/verification" element={ <VerificationPendingPage/> }/>
            <Route path="/invalid-campaign" element={<CampaignNotFoundPage />} />

            {/* GUEST ROUTES */}
            <Route
              path="/signin"
              element={
                <GuestRoute>
                  <SignInPage />
                </GuestRoute>
              }
            />
            {/* <Route path="/signin" element={<PublicRoute><SignInPage /></PublicRoute>} /> */}
            <Route 
            path="/campaign/:id" 
            element={
              <ProtectedRoute>
            <CampaignDetailsPage />
            </ProtectedRoute>
            } />

            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <SignupPage />
                </GuestRoute>
              }
            />
             {/* <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} /> */}

            {/* AUTH ONLY ROUTES */}
            <Route
              path="/organization-details"
              element={
                <GuestRoute>
                  <OrganizationDetailsPage />
                </GuestRoute>
              }
            />
            {/* <Route path="/organization-details" element={<PublicRoute><OrganizationDetailsPage /></PublicRoute>} /> */}

            <Route
              path="/dashboard/:id"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} /> */}

            <Route
              path="/create-campaign" //Here i THINK the id will be org id
              element={
                <ProtectedRoute>
                  <CreateCampaignPage />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/create-campaign" element={<ProtectedRoute><CreateCampaignPage /></ProtectedRoute>} /> */}

            <Route
              path="/donation-form-creator/:id"
              element={
                  <DonationFormCreatorPage />
              }
            />
            {/* <Route path="/donation-form-creator/:id" element={<ProtectedRoute><DonationFormCreatorPage /></ProtectedRoute>} /> */}

            <Route
              path="/donation-form-preview/:id"
              element={
                  <DonationFormPreviewPage />
              }
            />
            {/* <Route path="/donation-form-preview/:id" element={<ProtectedRoute><DonationFormPreviewPage /></ProtectedRoute>} /> */}

            <Route
              path="/payment-setup/:id"
              element={
                  <PaymentSetupPage />
              }
            />
            {/* <Route path="/payment-setup/:id" element={<ProtectedRoute><PaymentSetupPage /></ProtectedRoute>} /> */}

            <Route
              path="/account/:id"
              element={
                <ProtectedRoute>
                  <AccountInfoPage />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/account" element={<ProtectedRoute><AccountInfoPage /></ProtectedRoute>} /> */}


          

            

            {/* NOT FOUND */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </DonationProvider>
          </OrgProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
