import React, { useState, useMemo } from 'react';
import { mockContractsData } from '../../data/mockData';
import './Saque.css';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "R$ 0,00";
  return `R$${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Saque = () => {
  const [amount, setAmount] = useState('');

  const availableBalance = useMemo(() => {
    const totalCommissionGenerated = mockContractsData
      .filter(c => c.status === 'Valorizando')
      .reduce((sum, contract) => sum + (contract.value * 0.10), 0);
    const totalWithdrawnByConsultant = 0; 
    return totalCommissionGenerated - totalWithdrawnByConsultant;
  }, []);

  const handleWithdraw = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }
    if (numericAmount > availableBalance) {
      alert("O valor do saque não pode ser maior que o saldo disponível.");
      return;
    }
    alert(`Saque de ${formatCurrency(numericAmount)} solicitado com sucesso!`);
    setAmount('');
  };

  return (
    <div className="saque-page"> {/* CLASSE RENOMEADA AQUI */}
      <div className="page-header">
        <h1>Saque</h1>
        <p>Gerencie suas comissões e solicite seus saques</p>
      </div>
      <div className="card-base saque-card">
        <div className="saldo-disponivel">
          <span>Saldo Disponível</span>
          <h2 className="saldo-valor">{formatCurrency(availableBalance)}</h2>
        </div>
        <div className="saque-form">
          <label htmlFor="valor-saque">Valor do Saque</label>
          <div className="saque-input-wrapper">
            <span className="input-prefix">R$</span>
            <input
              id="valor-saque"
              type="number"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button className="saque-button" onClick={handleWithdraw}>
            <i className="fa-solid fa-paper-plane"></i>
            Solicitar Saque
          </button>
        </div>
      </div>
    </div>
  );
};

export default Saque;