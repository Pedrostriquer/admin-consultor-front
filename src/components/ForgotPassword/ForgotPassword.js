import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../dbServices/authService";
import "./ForgotPassword.css"; // Vamos criar este arquivo a seguir

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.data.message);
    } catch (err) {
      setError("Ocorreu um erro ao tentar enviar o e-mail. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="login-branding">
        {" "}
        {/* Reutilizando o estilo da página de login */}
        <div className="branding-content">
          <i className="fa-solid fa-chart-line branding-icon"></i>
          <h1 className="branding-h1">Plataforma do Consultor</h1>
          <p className="branding-p">
            Recupere seu acesso para continuar gerenciando seus resultados.
          </p>
        </div>
      </div>
      <div className="form-area">
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <h2 className="form-h2">Esqueceu sua senha?</h2>
          <p className="form-subtitle">
            Sem problemas! Digite seu e-mail abaixo e enviaremos um link para
            você redefinir sua senha.
          </p>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          {!message && ( // Esconde o formulário após o sucesso
            <>
              <div className="input-group">
                <i className="fa-solid fa-envelope input-icon"></i>
                <input
                  type="email"
                  placeholder="Seu e-mail de acesso"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
              </button>
            </>
          )}

          <div className="back-to-login">
            <Link to="/login">Voltar para o Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
