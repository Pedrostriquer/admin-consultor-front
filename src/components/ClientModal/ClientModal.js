import React, { useState } from 'react';
import CountUp from 'react-countup';
import './ClientModal.css';

const ITEMS_PER_PAGE = 5;

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "R$ 0,00";
  return `R$${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return new Date(); 
  }
  const [day, month, year] = dateString.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const ClientModal = ({ client, onClose }) => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [searchTerms, setSearchTerms] = useState({ contracts: '', withdrawals: '' });
  const [currentPage, setCurrentPage] = useState({ contracts: 1, withdrawals: 1 });

  const getPaginatedData = (data, searchTerm, page) => {
    const filteredData = data.filter(item => 
      String(item.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedItems = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    return { paginatedItems, totalPages };
  };
  
  const { paginatedItems: paginatedContracts, totalPages: totalContractPages } = getPaginatedData(client.contracts, searchTerms.contracts, currentPage.contracts);
  const { paginatedItems: paginatedWithdrawals, totalPages: totalWithdrawalPages } = getPaginatedData(client.withdrawals, searchTerms.withdrawals, currentPage.withdrawals);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerms(prev => ({ ...prev, [activeTab]: term }));
    setCurrentPage(prev => ({ ...prev, [activeTab]: 1 }));
  };

  const changePage = (direction) => {
    setCurrentPage(prev => {
      const newPage = prev[activeTab] + direction;
      const totalPages = activeTab === 'contracts' ? totalContractPages : totalWithdrawalPages;
      if (newPage > 0 && newPage <= totalPages) {
        return { ...prev, [activeTab]: newPage };
      }
      return prev;
    });
  };

  const whatsappNumber = client.phone.replace(/\D/g, '');
  const whatsappLink = `https://wa.me/55${whatsappNumber}`;

  if (!client) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>

        <div className="modal-header">
          <div className="modal-avatar">{client.name.charAt(0)}</div>
          <div className="modal-client-info">
            <h2 className="modal-client-name">{client.name}</h2>
            <p className="modal-client-detail">CPF/CNPJ: {client.cpf}</p>
          </div>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-button"><i className="fa-brands fa-whatsapp"></i> Entrar em contato</a>
        </div>
        
        <div className="modal-stats-container">
          <div className="stat-card">
            <span>Disponível Saque</span>
            <div className="stat-value-container">
              <CountUp className="stat-value shine-effect green-text" end={client.availableForWithdrawal} duration={1.5} prefix="R$ " separator="." decimal="," decimals={2} />
            </div>
          </div>
          <div className="stat-card">
            <span>Valor Investido</span>
            <div className="stat-value-container">
              <CountUp className="stat-value shine-effect green-text" end={client.totalInvested} duration={1.5} prefix="R$ " separator="." decimal="," decimals={2} />
            </div>
          </div>
          <div className="stat-card">
            <span>Comissão Gerada</span>
            <div className="stat-value-container">
              <CountUp className="stat-value shine-effect green-text" end={client.commission} duration={1.5} prefix="R$ " separator="." decimal="," decimals={2} />
            </div>
          </div>
          <div className="stat-card">
            <span>Rank do Cliente</span>
            <div className="stat-value-container rank-value">
              <span className="hash">#</span>
              <CountUp className="stat-value shine-effect green-text" end={client.rank} duration={1.5} />
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="tabs"><button className={`tab-button ${activeTab === 'contracts' ? 'active' : ''}`} onClick={() => setActiveTab('contracts')}>Contratos</button><button className={`tab-button ${activeTab === 'withdrawals' ? 'active' : ''}`} onClick={() => setActiveTab('withdrawals')}>Saques</button></div>
          <div className="table-controls">
            <div className="table-search"><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Pesquisar por ID ou valor..." value={searchTerms[activeTab]} onChange={handleSearch} /></div>
            <div className="pagination">
              <button onClick={() => changePage(-1)} disabled={currentPage[activeTab] === 1}><i className="fa-solid fa-chevron-left"></i></button>
              <span>Página {currentPage[activeTab]} de {activeTab === 'contracts' ? totalContractPages : totalWithdrawalPages}</span>
              <button onClick={() => changePage(1)} disabled={currentPage[activeTab] === (activeTab === 'contracts' ? totalContractPages : totalWithdrawalPages)}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          
          {activeTab === 'contracts' && (
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>ID</th><th>Valor Investido</th><th>Lucro Gerado</th><th>Val. Mensal</th><th>% Progresso</th><th>Meta de Val.</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {paginatedContracts.length > 0 ? paginatedContracts.map(c => {
                    const profit = c.value * (c.currentProgress / 100);
                    const startDate = parseDate(c.startDate);
                    const endDate = parseDate(c.endDate);
                    const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
                    const monthlyValorization = totalMonths > 0 ? (c.currentProgress / totalMonths) : 0;
                    return (
                      <tr key={c.id}>
                        <td>#{c.id}</td><td>{formatCurrency(c.value)}</td><td>{formatCurrency(profit)}</td><td>{monthlyValorization.toFixed(2)}%</td>
                        <td><div className="progress-cell"><div className="progress-bar-bg"><div className="progress-bar-fg" style={{ width: `${c.currentProgress}%` }}></div></div><span>{c.currentProgress}%</span></div></td>
                        <td>{c.finalValorizationPercentage}%</td><td><span className={`status-badge status-${c.status.toLowerCase()}`}>{c.status}</span></td>
                      </tr>
                    )
                  }) : ( <tr><td colSpan="7">Nenhum contrato encontrado.</td></tr> )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'withdrawals' && (
            <div className="table-container">
              <table>
                <thead><tr><th>ID</th><th>Valor Solicitado</th><th>Data</th><th>Status</th></tr></thead>
                <tbody>
                {paginatedWithdrawals.length > 0 ? paginatedWithdrawals.map(w => ( <tr key={w.id}><td>#{w.id}</td><td>{formatCurrency(w.value)}</td><td>{w.date}</td><td><span className={`status-badge status-${w.status.toLowerCase()}`}>{w.status}</span></td></tr> )) : ( <tr><td colSpan="4">Nenhum saque encontrado.</td></tr> )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientModal;