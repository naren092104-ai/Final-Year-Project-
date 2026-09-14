/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewView } from './components/dashboard/OverviewView';
import { PatientsView } from './components/patients/PatientsView';
import { PatientProfileView } from './components/patients/PatientProfileView';
import { DigitalTwinView } from './components/digitaltwin/DigitalTwinView';
import { LiveMonitoringView } from './components/monitoring/LiveMonitoringView';
import { AgentsView } from './components/agents/AgentsView';
import { AlertsView } from './components/alerts/AlertsView';
import { ClinicalDecisionsView } from './components/decisions/ClinicalDecisionsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SimulationView } from './components/simulation/SimulationView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { AddPatientModal } from './components/modals/AddPatientModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainLayout: React.FC = () => {
  const { currentPage } = useHospital();

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewView />;
      case 'patients':
        return <PatientsView />;
      case 'patient-profile':
        return <PatientProfileView />;
      case 'digital-twin':
        return <DigitalTwinView />;
      case 'live-monitoring':
        return <LiveMonitoringView />;
      case 'agents':
        return <AgentsView />;
      case 'alerts':
        return <AlertsView />;
      case 'decisions':
        return <ClinicalDecisionsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'simulation':
        return <SimulationView />;
      case 'audit':
        return <AuditLogsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Side Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <AddPatientModal />
      <SettingsModal />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainLayout />
    </HospitalProvider>
  );
}
