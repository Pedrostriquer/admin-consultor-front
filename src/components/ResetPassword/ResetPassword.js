import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import authService from "../../dbServices/authService";
import "./ResetPassword.css"; // Usará estilos parecidos com o ForgotPassword

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const resetCode = searchParams.get("code");
    if (resetCode) {
      setCode(resetCode);
    } else {
      setError(
        "Código de redefinição não encontrado na URL. Verifique o link."
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await authService.resetPassword(code, password);
      setMessage(
        response.data.message + " Você será redirecionado para o login..."
      );

      // Redireciona para o login após 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Código inválido ou expirado. Tente solicitar um novo link."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="login-branding">
        <div className="branding-content">
          <i className="fa-solid fa-shield-halved branding-icon"></i>
          <h1 className="branding-h1">Redefinir Senha</h1>
          <p className="branding-p">
            Crie uma nova senha forte e segura para proteger sua conta.
          </p>
        </div>
      </div>
      <div className="form-area">
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <h2 className="form-h2">Crie sua nova senha</h2>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          {!message &&
            code && ( // Só mostra o form se não houver mensagem de sucesso e o código existir
              <>
                <div className="input-group">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input
                    type="password"
                    placeholder="Nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input
                    type="password"
                    placeholder="Confirme a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : "Redefinir Senha"}
                </button>
              </>
            )}
          {!message && (
            <div className="back-to-login">
              <Link to="/login">Voltar para o Login</Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
