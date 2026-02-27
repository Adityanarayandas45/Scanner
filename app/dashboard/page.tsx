"use client";

import { useState } from "react";
import StepperForm from "../components/StepperForm";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("survey");

  return ( <>
    <div className="dashboard-wrapper">


      <div className="sidebar">
        <h4 className="sidebar-title">Dashboard</h4>

        <div
          className={`sidebar-item ${
            activeTab === "survey" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("survey")}
        >
          Survey
        </div>
      </div>


    
<div className="content-area">
  {activeTab === "survey" && <StepperForm />}
</div>
    </div>
</>
  );
};

export default Dashboard;