import React, { useState, useMemo } from 'react';
import ClientModal from '../ClientModal/ClientModal';
import { mockClientsData, mockContractsData, mockWithdrawalsData } from '../../data/mockData';
import './Clientes.css';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "R$ 0,00";
  return `R$${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Clientes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const processedClients = useMemo(() => {
    const clientsWithStats = mockClientsData.map(client => {
      const contracts = mockContractsData.filter(c => c.clientId === client.id);
      const activeContracts = contracts.filter(c => c.status === 'Valorizando');
      const totalInvested = activeContracts.reduce((sum, c) => sum + c.value, 0);
      const commission = totalInvested * 0.10;
      
      const withdrawals = mockWithdrawalsData.filter(w => w.clientId === client.id);
      const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.value, 0);

      const totalProfit = activeContracts.reduce((sum, c) => sum + (c.value * (c.currentProgress / 100)), 0);
      const availableForWithdrawal = Math.max(0, totalProfit - totalWithdrawn);
      
      return { ...client, totalInvested, commission, contracts, withdrawals, availableForWithdrawal };
    });

    clientsWithStats.sort((a, b) => b.totalInvested - a.totalInvested);
    return clientsWithStats.map((client, index) => ({ ...client, rank: index + 1 }));
  }, []);

  const [clients] = useState(processedClients);

  const handleRowClick = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  return (
    <div className="clientes-page">
      <div className="page-header">
        <h1>Clientes</h1>
        <div className="header-actions">
          <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Buscar por nome, CPF ou telefone..." />
          </div>
        </div>
      </div>

      <div className="table-wrapper card-base">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Nome</th>
              <th>CPF/CNPJ</th>
              <th>Email</th>
              <th>Celular</th>
              <th>Valor Investido</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} onClick={() => handleRowClick(client)}>
                <td>#{client.rank}</td>
                <td>{client.name}</td>
                <td>{client.cpf}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{formatCurrency(client.totalInvested)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <ClientModal client={selectedClient} onClose={closeModal} />}
    </div>
  );
};

export default Clientes;