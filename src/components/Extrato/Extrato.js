import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockContractsData, mockConsultantWithdrawalsData } from '../../data/mockData';
import './Extrato.css';

const ITEMS_PER_PAGE = 5;

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "R$ 0,00";
  return `R$${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return new Date(0);
  const [day, month, year] = dateString.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const Extrato = () => {
  const [activeTab, setActiveTab] = useState('comissoes');
  const [sorts, setSorts] = useState({
    comissoes: { key: 'date', direction: 'desc' },
    saques: { key: 'date', direction: 'desc' },
  });
  const [pages, setPages] = useState({ comissoes: 1, saques: 1 });

  // 1. Processamento inicial dos dados (só roda uma vez)
  const processedData = useMemo(() => {
    const commissionEvents = mockContractsData
      .filter(c => c.status === 'Valorizando')
      .map(c => ({
        id: `c-${c.id}`,
        type: 'credit',
        description: `Comissão - Contrato #${c.id}`,
        date: c.startDate,
        value: c.value * 0.10,
      }));

    const consultantWithdrawals = mockConsultantWithdrawalsData.map(w => ({
      ...w,
      type: 'debit',
    }));

    // Cálculos para os cards
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const incomeThisMonth = commissionEvents
      .filter(c => {
        const eventDate = parseDate(c.date);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      })
      .reduce((sum, c) => sum + c.value, 0);

    const withdrawnThisMonth = consultantWithdrawals
      .filter(w => {
        const eventDate = parseDate(w.date);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      })
      .reduce((sum, w) => sum + w.value, 0);

    const totalCommission = commissionEvents.reduce((sum, c) => sum + c.value, 0);
    const totalWithdrawn = consultantWithdrawals.reduce((sum, w) => sum + w.value, 0);
    const availableBalance = totalCommission - totalWithdrawn;

    return { commissionEvents, consultantWithdrawals, incomeThisMonth, withdrawnThisMonth, availableBalance };
  }, []);

  // 2. Ordena os dados com base na seleção do usuário
  const sortedData = useMemo(() => {
    const sortableCommissions = [...processedData.commissionEvents];
    const sortableWithdrawals = [...processedData.consultantWithdrawals];
    const sortConfigComissoes = sorts.comissoes;
    const sortConfigSaques = sorts.saques;

    const sortFunction = (a, b, config) => {
      const valA = config.key === 'date' ? parseDate(a.date).getTime() : a.value;
      const valB = config.key === 'date' ? parseDate(b.date).getTime() : b.value;
      if (valA < valB) return config.direction === 'asc' ? -1 : 1;
      if (valA > valB) return config.direction === 'asc' ? 1 : -1;
      return 0;
    };
    
    sortableCommissions.sort((a, b) => sortFunction(a, b, sortConfigComissoes));
    sortableWithdrawals.sort((a, b) => sortFunction(a, b, sortConfigSaques));

    return { comissoes: sortableCommissions, saques: sortableWithdrawals };
  }, [processedData, sorts]);
  
  // 3. Pagina os dados ordenados
  const activeList = sortedData[activeTab];
  const currentPage = pages[activeTab];
  const totalPages = Math.ceil(activeList.length / ITEMS_PER_PAGE);
  const paginatedItems = activeList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split('-');
    setSorts(prev => ({ ...prev, [activeTab]: { key, direction } }));
    setPages(prev => ({ ...prev, [activeTab]: 1 }));
  };

  const changePage = (direction) => {
    setPages(prev => ({ ...prev, [activeTab]: Math.max(1, Math.min(prev[activeTab] + direction, totalPages)) }));
  };

  return (
    <div className="extrato-page">
      <div className="page-header"><h1>Extrato</h1><p>Acompanhe suas movimentações de comissões e saques.</p></div>
      
      <div className="summary-cards-grid">
        <div className="card-base summary-card"><span>Entrou este Mês</span><strong>{formatCurrency(processedData.incomeThisMonth)}</strong></div>
        <div className="card-base summary-card"><span>Saiu este Mês</span><strong>{formatCurrency(processedData.withdrawnThisMonth)}</strong></div>
        <Link to="/saque" className="card-base summary-card clickable">
          <span>Disponível para Saque</span>
          <strong>{formatCurrency(processedData.availableBalance)}</strong>
          <div className="card-link"><i className="fa-solid fa-arrow-right"></i> Ir para Saque</div>
        </Link>
      </div>

      <div className="card-base extrato-content">
        <div className="tabs"><button className={`tab-button ${activeTab === 'comissoes' ? 'active' : ''}`} onClick={() => setActiveTab('comissoes')}>Comissões Recebidas</button><button className={`tab-button ${activeTab === 'saques' ? 'active' : ''}`} onClick={() => setActiveTab('saques')}>Saques Realizados</button></div>
        
        <div className="extrato-controls">
          <div className="sort-filter">
            <label htmlFor="sort-select">Ordenar por:</label>
            <select id="sort-select" value={`${sorts[activeTab].key}-${sorts[activeTab].direction}`} onChange={handleSortChange}>
              <option value="date-desc">Mais Recentes</option>
              <option value="date-asc">Mais Antigos</option>
              <option value="value-desc">Maior Valor</option>
              <option value="value-asc">Menor Valor</option>
            </select>
          </div>
          <div className="pagination">
            <button onClick={() => changePage(-1)} disabled={currentPage === 1}><i className="fa-solid fa-chevron-left"></i></button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => changePage(1)} disabled={currentPage === totalPages}><i className="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead><tr><th>Descrição</th><th>Data</th><th>Valor</th></tr></thead>
            <tbody>
              {paginatedItems.length > 0 ? paginatedItems.map(item => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{item.date}</td>
                  <td><span className={`type-indicator type-${item.type}`}>{item.type === 'credit' ? '+' : '-'} {formatCurrency(item.value)}</span></td>
                </tr>
              )) : (<tr><td colSpan="3">Nenhum registro encontrado.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Extrato;