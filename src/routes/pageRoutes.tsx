import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EvmPage from "../components/evmPage";
import { CandidateForm } from "../components/Form/CandidateForm";

const PageRoute: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Valid route → EVM Voting Page */}
        <Route path="/:id" element={<EvmPage />} />
        <Route path="/evm/:id" element={<EvmPage />} />

        {/* Secret admin form page */}
        <Route path="/qwerty-evm" element={<CandidateForm />} />

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
