import React, { useState } from 'react';
import { LayoutDashboard, ClipboardList, Trello, Users, DollarSign, Package, FileText, Settings, Bell, Search, Menu, Calendar, Boxes } from 'lucide-react';
import { MenuItem } from './components/shared/MenuItem';
import { Dashboard } from './components/dashboard/DashboardPage';
import { ProjetosPage } from './components/projetos/ProjetosPage';
import { KanbanPage } from './components/kanban/KanbanPage';
import { EquipePage } from './components/equipe/EquipePage';
import { FinanceiroPage } from './components/financeiro/FinanceiroPage';
import { MateriaisPage } from './components/materiais/MateriaisPage';
import { EstoquePage } from './components/materiais/estoque/EstoquePage';
import { RelatoriosPage } from './components/relatorios/RelatoriosPage';
import { ConfiguracoesPage } from './components/configuracoes/ConfiguracoesPage';
import { CronogramaPage } from './components/cronograma/CronogramaPage';

export default function App() {
  const [menuAtivo, setMenuAtivo] = useState('dashboard');
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  const toggleMenuMobile = () => {
    setMenuMobileAberto(!menuMobileAberto);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                className="p-2 rounded-md lg:hidden"
                onClick={toggleMenuMobile}
              >
                <Menu className="h-6 w-6" />
              </button>
              <span className="text-xl font-bold ml-2">M.A.R.I. - Monitoramento e Análise de Resultados Integrados</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-blue-500 rounded-lg px-3 py-1">
                <Search className="h-5 w-5 text-blue-200" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent border-none focus:ring-0 text-white placeholder-blue-200 ml-2"
                />
              </div>
              
              <button className="relative p-2">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-lg transform 
          ${menuMobileAberto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}>
          <nav className="p-4 space-y-2">
            <MenuItem 
              icone={<LayoutDashboard />}
              texto="Dashboard"
              ativo={menuAtivo === 'dashboard'}
              onClick={() => setMenuAtivo('dashboard')}
            />
            <MenuItem 
              icone={<ClipboardList />}
              texto="Projetos"
              ativo={menuAtivo === 'projetos'}
              onClick={() => setMenuAtivo('projetos')}
            />
            <MenuItem 
              icone={<Calendar />}
              texto="Cronograma"
              ativo={menuAtivo === 'cronograma'}
              onClick={() => setMenuAtivo('cronograma')}
            />
            <MenuItem 
              icone={<Trello />}
              texto="Kanban"
              ativo={menuAtivo === 'kanban'}
              onClick={() => setMenuAtivo('kanban')}
            />
            <MenuItem 
              icone={<Users />}
              texto="Equipe"
              ativo={menuAtivo === 'equipe'}
              onClick={() => setMenuAtivo('equipe')}
            />
            <MenuItem 
              icone={<DollarSign />}
              texto="Financeiro"
              ativo={menuAtivo === 'financeiro'}
              onClick={() => setMenuAtivo('financeiro')}
            />
            <MenuItem 
              icone={<Package />}
              texto="Materiais"
              ativo={menuAtivo === 'materiais'}
              onClick={() => setMenuAtivo('materiais')}
            />
            <MenuItem 
              icone={<Boxes />}
              texto="Estoque"
              ativo={menuAtivo === 'estoque'}
              onClick={() => setMenuAtivo('estoque')}
            />
            <MenuItem 
              icone={<FileText />}
              texto="Relatórios"
              ativo={menuAtivo === 'relatorios'}
              onClick={() => setMenuAtivo('relatorios')}
            />
            <MenuItem 
              icone={<Settings />}
              texto="Configurações"
              ativo={menuAtivo === 'configuracoes'}
              onClick={() => setMenuAtivo('configuracoes')}
            />
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {menuAtivo === 'dashboard' && <Dashboard />}
          {menuAtivo === 'projetos' && <ProjetosPage />}
          {menuAtivo === 'cronograma' && <CronogramaPage />}
          {menuAtivo === 'kanban' && <KanbanPage />}
          {menuAtivo === 'equipe' && <EquipePage />}
          {menuAtivo === 'financeiro' && <FinanceiroPage />}
          {menuAtivo === 'materiais' && <MateriaisPage />}
          {menuAtivo === 'estoque' && <EstoquePage />}
          {menuAtivo === 'relatorios' && <RelatoriosPage />}
          {menuAtivo === 'configuracoes' && <ConfiguracoesPage />}
        </main>
      </div>
    </div>
  );
}
