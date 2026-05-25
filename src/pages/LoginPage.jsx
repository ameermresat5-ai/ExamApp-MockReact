import LoginForm from "../components/auth/LoginForm";

function LoginPage({ onLogin, onGoToRegister }) {
  return (
    <main className="auth-page">
      <section className="hero-section">
        <h1>ExamApp Mock React</h1>
        <p>
          A client-side exam management system for teachers and students.
        </p>
      </section>

      <LoginForm onLogin={onLogin} onGoToRegister={onGoToRegister} />
    </main>
  );
}

export default LoginPage;
