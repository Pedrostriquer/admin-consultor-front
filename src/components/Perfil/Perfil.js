import React, { useState } from 'react';
import { consultantProfileData } from '../../data/mockData';
import './Perfil.css';

const Perfil = () => {
  const [profileData] = useState(consultantProfileData);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileData.indicationLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Mostra a mensagem por 2 segundos
    });
  };

  return (
    <div className="perfil-page">
      <div className="page-header">
        <h1>Meu Perfil</h1>
        <p>Visualize e gerencie suas informações pessoais.</p>
      </div>

      <div className="card-base perfil-card">
        <div className="perfil-header">
          <div className="perfil-avatar">PS</div>
          <div className="perfil-header-info">
            <h2 className="perfil-name">{profileData.name}</h2>
            <span className="perfil-role">{profileData.role}</span>
          </div>
        </div>

        <div className="perfil-details-grid">
          <div className="detail-item">
            <label>Email</label>
            <span>{profileData.email}</span>
          </div>
          <div className="detail-item">
            <label>CPF</label>
            <span>{profileData.cpf}</span>
          </div>
          <div className="detail-item">
            <label>Comissão</label>
            <span>{profileData.commissionPercentage}%</span>
          </div>
          <div className="detail-item detail-item-full">
            <label>Seu Link de Indicação</label>
            <div className="indication-link-wrapper">
              <input type="text" value={profileData.indicationLink} readOnly />
              <button onClick={handleCopyLink}>
                {isCopied ? <><i className="fa-solid fa-check"></i> Copiado!</> : <><i className="fa-solid fa-copy"></i> Copiar</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;