import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormAction from "./formAction";
import FormExtra from "./formExtra";
import Input from "./input";
import { loginFields } from "../formFields";
import { useAuth } from "../../../context/authContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      login(data.token, data.user);

      if (data.user.role === "sysadmin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
      )}

      <div>
        {loginFields.map((field) => (
          <Input
            key={field.id}
            label={field.labelText}
            type={field.type}
            value={field.id === "username" ? username : password}
            onChange={(e) => {
              const value = e.target.value;
              field.id === "username" ? setUsername(value) : setPassword(value);
              setError(""); // Clear error when user types
            }}
            placeholder={field.placeholder}
            disabled={isLoading}
          />
        ))}
      </div>

      <FormExtra />
      <FormAction
        isLoading={isLoading}
        text={isLoading ? "Logging in..." : "Login"}
      />
    </form>
  );
};

export default Login;
