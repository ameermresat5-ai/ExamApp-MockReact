import RegisterForm from "../components/auth/RegisterForm";

function RegisterPage({ onRegister, onGoToLogin }) {
  return (
    <main className="auth-page">
      <section className="hero-section">
        <h1>Create Account</h1>
        <p>
          Register as a teacher or student and continue to the application.
        </p>
      </section>

      <RegisterForm onRegister={onRegister} onGoToLogin={onGoToLogin} />
    </main>
  );
}

export default RegisterPage;
