import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export default function LoginPage() {
  const STATE_MACHINE_NAME = "Login Machine"; // Name of your state machine

  // Initialize Rive with the animation
  const { rive, RiveComponent } = useRive({
    src: "/register.riv",
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true, // Autoplay to allow manual control
  });

  // Define Rive state machine inputs
  const isFocusInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "isFocus"
  );
  const isPrivateFieldInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "isPrivateField"
  );
  const successTriggerInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "successTrigger"
  );
  const failTriggerInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "failTrigger"
  );

  // State for login inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  // Handle login submission
  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        { email, password }
      );
      setUser(data);
      // Trigger success animation
      if (successTriggerInput) {
        successTriggerInput.fire();
      }
      setRedirect(true);
    } catch {
      // Trigger fail animation
      if (failTriggerInput) {
        failTriggerInput.fire();
      }
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        {/* Login Form */}
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          {/* Rive Animation Component */}
          <div style={{ width: "100%", height: "350px" }}>
            <RiveComponent />
          </div>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            onFocus={() => {
              if (isFocusInput) isFocusInput.value = true; // Focus animation on
            }}
            onBlur={() => {
              if (isFocusInput) isFocusInput.value = false; // Focus animation off
            }}
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => {
              setPassword(ev.target.value);
              if (isPrivateFieldInput) isPrivateFieldInput.value = true; // Set private field
            }}
            onFocus={() => {
              if (isFocusInput) isFocusInput.value = true; // Focus animation on
            }}
            onBlur={() => {
              if (isPrivateFieldInput) isPrivateFieldInput.value = false; // Reset private field
              if (isFocusInput) isFocusInput.value = false; // Focus animation off
            }}
          />

          {/* Submit Button */}
          <button className="primary">Login</button>

          {/* Link to Register Page */}
          <div className="text-center py-2 text-gray-500">
            Do not have an account yet?{" "}
            <Link className="underline text-blue-600" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
