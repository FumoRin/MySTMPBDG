import { useState, ChangeEvent } from "react";
import { loginFields, Field } from "../formFields";
import FormAction from "./formAction";
import FormExtra from "./formExtra";
import Input from "./input";

interface LoginState {
  [key: string]: string;
}

const fields: Field[] = loginFields;
let fieldsState: LoginState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
  const [loginState, setLoginState] = useState<LoginState>(fieldsState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authenticateUser();
  };

  const authenticateUser = () => {};

  return (
    <form className="mt-8 ">
      <div>
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>
      <FormExtra />
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
}
