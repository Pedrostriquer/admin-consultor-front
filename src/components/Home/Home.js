import React, { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { mockClientsData, mockContractsData, consultantsList, LOGGED_CONSULTANT_ID } from '../../data/mockData';
import './Home.css';

// Helper para parsear datas
const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return new Date(0);
  const [day, month, year] = dateString.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

// Componente customizado para a barra arredondada
const RoundedBar = (props) => {
  const { x, y, width, height, fill } = props;
  const radius = 8;
  return (
    <path
      d={`M${x},${y + radius} A${radius},${radius} 0 0 1 ${x + radius},${y} L${
        x + width - radius
      },${y} A${radius},${radius} 0 0 1 ${x + width},${y + radius} L${
        x + width
      },${y + height} L${x},${y + height} Z`}
      fill={fill}
    />
  );
};

// Função para formatar valores monetários
const formatCurrency = (value) => {
  if (value === null || value === undefined) return "R$ 0,00";
  return `R$${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const Home = () => {
  const processedData = useMemo(() => {
    // --- Lógica para os cards e lista de clientes ---
    const clientsWithStats = mockClientsData.map(client => {
      const clientContracts = mockContractsData.filter(c => c.clientId === client.id && c.status === 'Valorizando');
      const totalInvested = clientContracts.reduce((sum, c) => sum + c.value, 0);
      return { ...client, totalInvested };
    });
    clientsWithStats.sort((a, b) => b.totalInvested - a.totalInvested);
    const bestClients = clientsWithStats.slice(0, 4);
    const topClientGoal = bestClients[0]?.totalInvested || 1;
    const totalClients = mockClientsData.length;
    const totalContracts = mockContractsData.filter(c => c.status === 'Valorizando').length;
    const actualMonthIncome = clientsWithStats.reduce((sum, c) => sum + c.totalInvested, 0) * 0.05; 
    const previousMonthIncome = actualMonthIncome * 0.85;

    // --- Lógica para o Ranking de Consultores ---
    const currentYear = new Date().getFullYear();
    const rankedConsultants = consultantsList.map(consultant => {
      const salesThisYear = mockContractsData
        .filter(c => c.consultantId === consultant.id && parseDate(c.startDate).getFullYear() === currentYear)
        .reduce((sum, c) => sum + c.value, 0);
      return { ...consultant, totalSales: salesThisYear };
    }).sort((a, b) => b.totalSales - a.totalSales)
      .map((c, index) => ({ ...c, rank: index + 1 }));

    const top10Consultants = rankedConsultants.slice(0, 5);
    const loggedConsultantInfo = rankedConsultants.find(c => c.id === LOGGED_CONSULTANT_ID);
    const isLoggedConsultantInTop10 = loggedConsultantInfo && loggedConsultantInfo.rank <= 5;
    
    return { bestClients, topClientGoal, totalClients, totalContracts, actualMonthIncome, previousMonthIncome, top10Consultants, loggedConsultantInfo, isLoggedConsultantInTop10 };
  }, []);

  const kpiData = [
    { title: "Quantidade de Clientes", value: processedData.totalClients, data: [{ v: 1 }, { v: 2 }, { v: 2 }, { v: 3 }, { v: 4 }] },
    { title: "Contratos Ativos", value: processedData.totalContracts, data: [{ v: 4 }, { v: 6 }, { v: 9 }, { v: 15 }, { v: 20 }] },
    { title: "Faturamento Mês Atual", value: `R$ ${(processedData.actualMonthIncome / 1000).toFixed(1)}k`, data: [{ v: 20000 }, { v: 18000 }, { v: 35000 }, { v: 45800 }] },
    { title: "Faturamento Mês Anterior", value: `R$ ${(processedData.previousMonthIncome / 1000).toFixed(1)}k`, data: [{ v: 15000 }, { v: 19000 }, { v: 25000 }, { v: 32100 }] },
  ];
  
  const barChartData = [
    { month: 'jan.', Faturamento: 10 }, { month: 'fev.', Faturamento: 25 }, { month: 'mar.', Faturamento: 18 }, { month: 'abr.', Faturamento: 50 },
    { month: 'mai.', Faturamento: 98 }, { month: 'jun.', Faturamento: 60 }, { month: 'jul.', Faturamento: 75 },
  ];

  return (
    <div className="home-container">
      <header className="dashboard-header">
        <h1 className="header-h1">Dashboard</h1>
        <p className="header-p">Visão geral do desempenho dos contratos</p>
      </header>

      <section className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <div key={index} className="card-base kpi-card">
            <div className="kpi-content">
              <span className="kpi-title">{kpi.title}</span>
              <span className="kpi-value">{kpi.value}</span>
            </div>
            <div className="kpi-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs><linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                  <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradient-blue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </section>

      <section className="main-grid">
        <div className="card-base main-chart-card">
          <h3 className="card-title">Visão Geral do Faturamento</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(val) => `R$${val}k`} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "12px", }} formatter={(value) => `${formatCurrency(value * 1000)}`} />
              <Bar dataKey="Faturamento" shape={<RoundedBar />} fill="#3b82f6" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card-base clients-card">
          <h3 className="card-title">Melhores Clientes</h3>
          <ul className="clients-list">
            {processedData.bestClients.map((client) => (
              <li key={client.id} className="client-item">
                <div className="client-avatar">{client.name.charAt(0)}</div>
                <div className="client-info"><span className="client-name">{client.name}</span><div className="progress-bar"><div className="progress" style={{ width: `${(client.totalInvested / processedData.topClientGoal) * 100}%` }}></div></div></div>
                <span className="client-sales">{formatCurrency(client.totalInvested)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card-base ranking-section">
        <h3 className="card-title">Ranking de Consultores (Vendas no Ano)</h3>
        <ol className="consultant-ranking-list">
          {processedData.top10Consultants.map(consultant => (
            <li key={consultant.id} className={`consultant-item ${consultant.id === LOGGED_CONSULTANT_ID ? 'highlight' : ''}`}>
              <span className="rank-number">{consultant.rank}º</span>
              <div className="rank-avatar">{consultant.avatar}</div>
              <span className="rank-name">{consultant.name}</span>
              <span className="rank-sales">{formatCurrency(consultant.totalSales)}</span>
            </li>
          ))}
          
          {!processedData.isLoggedConsultantInTop10 && processedData.loggedConsultantInfo && (
            <>
              <div className="rank-separator"></div>
              <li className="consultant-item highlight">
                <span className="rank-number">{processedData.loggedConsultantInfo.rank}º</span>
                <div className="rank-avatar">{processedData.loggedConsultantInfo.avatar}</div>
                <span className="rank-name">{processedData.loggedConsultantInfo.name}</span>
                <span className="rank-sales">{formatCurrency(processedData.loggedConsultantInfo.totalSales)}</span>
              </li>
            </>
          )}
        </ol>
      </section>
    </div>
  );
};

export default Home;