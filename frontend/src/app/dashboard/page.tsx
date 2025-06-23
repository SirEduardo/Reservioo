'use client'

// Importar todos los componentes de tabs
import { ThemedCard } from '../components/themed/card'
import { ThemeProvider } from '@/context/theme-context'
import { useDashboard } from '@/context/dashboard-Context'
import BookingTab from '../components/tabs/bookings-tab'
import SettingsTab from '../components/tabs/settings-tab'
import SchedulesTab from '../components/tabs/schedules-tab'
import ServicesTab from '../components/tabs/services-tab'
import ProfessionalsTab from '../components/tabs/professionals-tab'
import { tabs } from '../mocks'

function DashboardContent() {
  const { activeTab, setActiveTab } = useDashboard()

  // Estados para configuración

  return (
    <main
      className="min-h-screen p-2 sm:p-4"
      style={{ backgroundColor: '#f9fafb' }}
    >
      <div className="max-w-7xl mx-auto pt-4 sm:pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Panel de Gestión
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Administra profesionales, servicios, horarios y reservas
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl px-4 sm:px-6 py-3 shadow-sm flex items-center border border-gray-200">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm sm:text-base font-medium text-gray-700">
                Sistema activo
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ThemedCard className="rounded-t-xl mb-0 p-0">
          <div className="flex overflow-x-auto scrollbar-hide justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-8 py-4 sm:py-5 font-medium text-sm sm:text-base flex-shrink-0 text-center cursor-pointer transition-all duration-200 whitespace-nowrap min-w-0 relative group border-b-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                    <Icon
                      className={`h-5 w-5 sm:h-5 sm:w-5 ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden text-xs">
                      {tab.label.split(' ')[0]}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </ThemedCard>

        <ThemedCard className="bg-white rounded-b-xl shadow-xl p-6">
          {/* Renderizar el tab activo */}
          {activeTab === 'reservas' && <BookingTab />}

          {activeTab === 'professionals' && <ProfessionalsTab />}

          {activeTab === 'services' && <ServicesTab />}

          {activeTab === 'schedules' && <SchedulesTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </ThemedCard>
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  )
}
