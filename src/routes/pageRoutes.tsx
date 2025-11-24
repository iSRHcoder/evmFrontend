import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EvmPage from "../components/evmPage";
import PanelEvmPage from "../components/panelPage";
import { CandidateForm } from "../components/Form/CandidateForm";
import { PanelForm } from "../components/Form/PanelForm";

const PageRoute: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Valid route → EVM Voting Page */}
        <Route path="/:id" element={<EvmPage />} />
        <Route path="/evm/:id" element={<EvmPage />} />
        <Route path="/panel/:id" element={<PanelEvmPage />} />

        {/* Secret admin form page */}
        <Route path="/qwerty-evm" element={<CandidateForm />} />
        <Route path="/panel-evm" element={<PanelForm />} />

        {/* Everything else → 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen text-xl font-bold">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default PageRoute;
