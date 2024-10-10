import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export default function RegisterPage() {
  const STATE_MACHINE_NAME = "Login Machine"; // Name of your state machine

  // Initialize Rive with the animation
  const { rive, RiveComponent } = useRive({
    src: "/register.riv",
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true, // Autoplay on to allow manual control
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
  // const isPrivateFieldShowInput = useStateMachineInput(
  //   rive,
  //   STATE_MACHINE_NAME,
  //   "isPrivateFieldShow"
  // );
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

  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle registration submission
  async function registerUser(ev) {
    ev.preventDefault();

    try {
      // Register the user
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, {
        name,
        email,
        password,
      });

      // Trigger success animation if registration is successful
      if (successTriggerInput) {
        successTriggerInput.fire();
      }
    } catch {
      // Trigger fail animation if registration fails
      if (failTriggerInput) {
        failTriggerInput.fire();
      }
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        {/* <h1 className="text-4xl text-center mb-4">Register</h1> */}

        {/* Registration form */}
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          {/* Rive Animation Component */}
          <div style={{ width: "100%", height: "350px" }}>
            <RiveComponent
            // onMouseEnter={() => {
            //   if (rive) rive.play();
            //   if (isFocusInput) isFocusInput.value = true; // Set focus when hovering
            // }}
            // onMouseLeave={() => {
            //   if (rive) rive.pause();
            //   if (isFocusInput) isFocusInput.value = false; // Remove focus when leaving
            // }}
            />
          </div>

          {/* Name Input */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            onFocus={() => {
              if (isFocusInput) isFocusInput.value = true; // Focus animation on
            }}
            onBlur={() => {
              if (isFocusInput) isFocusInput.value = false; // Focus animation off
            }}
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(ev) => {
              setEmail(ev.target.value);
            }}
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
              if (isPrivateFieldInput) isPrivateFieldInput.value = true; // Set as private field
              // if (isPrivateFieldShowInput) isPrivateFieldShowInput.value = true; // Show eye animation
            }}
            onFocus={() => {
              if (isFocusInput) isFocusInput.value = true; // Focus animation on
            }}
            onBlur={() => {
              if (isPrivateFieldInput) isPrivateFieldInput.value = false; // Reset private field
              // if (isPrivateFieldShowInput)
              //   isPrivateFieldShowInput.value = false; // Hide eye animation
              if (isFocusInput) isFocusInput.value = false;
            }}
          />

          {/* Submit Button */}
          <button className="primary">Register</button>

          {/* Link to Login Page */}
          <div className="text-center py-2 text-gray-500">
            Already a member?{" "}
            <Link className="underline text-blue-600" to={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
