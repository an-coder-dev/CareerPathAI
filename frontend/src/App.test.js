import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event"; // Required for navigation clicks
import App from "./App";

test("renders login page correctly", () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  );

  // Ensure Login page content is rendered
  expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
});

test("navigates to home page after login", async () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  );

  // Await the element before interacting with it
  userEvent.type(await screen.findByPlaceholderText("Enter your email..."), "test@example.com");
  userEvent.type(await screen.findByPlaceholderText("Enter your password..."), "password123");

  // Await the button before clicking it
  const loginButton = await screen.findByRole("button", { name: /login/i });
  userEvent.click(loginButton);

  // Wait for home page navigation
  expect(await screen.findByText(/welcome to home/i)).toBeInTheDocument();
});

test("navigates to signup page", async () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  );

  // Debug the DOM
  screen.debug();

  // Await the link before clicking it
  const signUpLink = await screen.findByRole("link", { name: /signup/i });
  userEvent.click(signUpLink);

  // Wait for signup page to load
  expect(await screen.findByText(/create your account/i)).toBeInTheDocument();
});