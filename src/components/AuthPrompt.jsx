import { useAuth } from "../context/useAuth";
import "../styles/AuthPrompt.css";

// Minimal badge-only prompt. Clicking it opens the AuthOverlay.
const AuthPrompt = ({ onAuthClick }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return null;

  return (
    <div className="auth-prompt-container">
      <div className="auth-badge" onClick={onAuthClick} title="Sign in with Google">
        <span className="auth-emoji">🔐</span>
      </div>
    </div>
  );
};

export default AuthPrompt;
