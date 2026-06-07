import { StrictMode, useEffect, useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Screen = "landing" | "login" | "signup" | "profile";

const routes: Record<string, Screen> = {
  "/": "landing",
  "/login": "login",
  "/signup": "signup",
  "/profile": "profile",
};

const paths: Record<Screen, string> = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  profile: "/profile",
};

function getCurrentScreen(): Screen {
  return routes[window.location.pathname] ?? "landing";
}

function App() {
  const [screen, setScreen] = useBrowserScreen();

  const navigate = (nextScreen: Screen) => {
    window.history.pushState({}, "", paths[nextScreen]);
    setScreen(nextScreen);
  };

  return (
    <main className="page-shell" aria-label="PopX assignment preview">
      <section className="phone-frame" aria-live="polite">
        {screen === "landing" && <LandingScreen onNavigate={navigate} />}
        {screen === "login" && <LoginScreen onNavigate={navigate} />}
        {screen === "signup" && <SignupScreen onNavigate={navigate} />}
        {screen === "profile" && <ProfileScreen />}
      </section>
    </main>
  );
}

function useBrowserScreen() {
  const [screen, setScreen] = useState<Screen>(getCurrentScreen);

  useEffect(() => {
    const syncScreen = () => setScreen(getCurrentScreen());
    window.addEventListener("popstate", syncScreen);
    return () => window.removeEventListener("popstate", syncScreen);
  }, []);

  return [screen, setScreen] as const;
}

type NavigateProps = {
  onNavigate: (screen: Screen) => void;
};

function LandingScreen({ onNavigate }: NavigateProps) {
  return (
    <div className="screen landing-screen">
      <div className="landing-copy">
        <h1>Welcome to PopX</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
      </div>

      <div className="button-stack">
        <Button onClick={() => onNavigate("signup")}>Create Account</Button>
        <Button variant="secondary" onClick={() => onNavigate("login")}>
          Already Registered? Login
        </Button>
      </div>
    </div>
  );
}

function LoginScreen({ onNavigate }: NavigateProps) {
  return (
    <div className="screen form-screen login-screen">
      <h1>
        Signin to your
        <br />
        PopX account
      </h1>
      <p className="intro-copy">
        Lorem ipsum dolor sit amet,
        <br />
        consectetur adipiscing elit,
      </p>

      <form className="form" onSubmit={(event) => event.preventDefault()}>
        <FloatingInput label="Email Address" placeholder="Enter email address" type="email" />
        <FloatingInput label="Password" placeholder="Enter password" type="password" />
        <Button className="login-button" onClick={() => onNavigate("profile")}>
          Login
        </Button>
      </form>
    </div>
  );
}

function SignupScreen({ onNavigate }: NavigateProps) {
  return (
    <div className="screen form-screen signup-screen">
      <h1>
        Create your
        <br />
        PopX account
      </h1>

      <form className="form signup-form" onSubmit={(event) => event.preventDefault()}>
        <FloatingInput label="Full Name" placeholder="" required />
        <FloatingInput label="Phone number" placeholder="" required />
        <FloatingInput label="Email address" placeholder="" type="email" required />
        <FloatingInput label="Password" placeholder="" type="password" required />
        <FloatingInput label="Company name" placeholder="" />

        <fieldset className="agency-field">
          <legend>
            Are you an Agency?<span>*</span>
          </legend>
          <label>
            <input type="radio" name="agency" defaultChecked />
            <span>Yes</span>
          </label>
          <label>
            <input type="radio" name="agency" />
            <span>No</span>
          </label>
        </fieldset>
      </form>

      <Button className="signup-submit" onClick={() => onNavigate("profile")}>
        Create Account
      </Button>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="screen profile-screen">
      <header className="profile-header">Account Settings</header>

      <section className="profile-panel">
        <div className="profile-summary">
          <div className="avatar-wrap" aria-label="Marry Doe">
            <div className="avatar-face">
              <span className="avatar-hair" />
              <span className="avatar-eye left" />
              <span className="avatar-eye right" />
              <span className="avatar-smile" />
            </div>
            <span className="camera-dot" aria-hidden="true">
              ●
            </span>
          </div>

          <div>
            <h1>Marry Doe</h1>
            <p>Marry@gmail.com</p>
          </div>
        </div>

        <p className="profile-copy">
          Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr, Sed Diam Nonumy Eirmod
          Tempor Invidunt Ut Labore Et Dolore Magna Aliquyam Erat, Sed Diam
        </p>
      </section>
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button className={`button button-${variant} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  );
}

type FloatingInputProps = {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: "email" | "password" | "text";
};

function FloatingInput({ label, placeholder, required = false, type = "text" }: FloatingInputProps) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <strong>*</strong>}
      </span>
      <input placeholder={placeholder} type={type} />
    </label>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
