import Header from "./authComponent/loginHeader";
import Login from "./authComponent/login";

export default function AuthPage() {
  return (
    <>
      <div className="container h-screen mx-auto px-72">
        <Header
          heading="Login to your account"
          paragraph="Don't have an account yet? "
          linkName="Signup"
          linkUrl="/signup"
        />
        <Login />
      </div>
    </>
  );
}
