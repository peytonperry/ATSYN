import { useState } from "react";
import {
  Container,
  Paper,
  Tabs,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Checkbox,
  Center,
  Stack,
  Loader,
  Alert,
} from "@mantine/core";
import { Navigate, useNavigate } from "react-router-dom";
import { apiService } from "../config/api";
import { useAuth } from "../components/Auth/AuthContext";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  interface RegisterDto {
    email: string;
    password: string;
  }

  interface LoginDto {
    email: string;
    password: string;
    rememberMe: boolean;
  }

  const [loginForm, setLoginForm] = useState<LoginDto>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [registerform, setregisterform] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      const loginData: LoginDto = {
        email: loginForm.email,
        password: loginForm.password,
        rememberMe: loginForm.rememberMe,
      };
      
      const data = await apiService.post("/auth/login", loginData);
      
      if (data != null) {
        const role =
          data.userRoles && data.userRoles.length > 0
            ? data.userRoles[0]
            : "User";
        login(data.userId, role, data.email);
        setLoading(false);
        navigate("/");
      }
    } catch (error: any) {
      setLoading(false);
      setErrorMessage("Error logging in. Please try again.");
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Validate passwords match
      if (registerform.password !== registerform.confirmPassword) {
        setErrorMessage("Passwords do not match");
        setLoading(false);
        return;
      }

      const registerData: RegisterDto = {
        email: registerform.email,
        password: registerform.password,
      };

      const data = await apiService.post("/auth/register", registerData);
      
      // Registration successful
      setLoading(false);
      setSuccessMessage("Account created successfully! Please log in.");
      
      // Pre-fill login email
      setLoginForm({
        ...loginForm,
        email: registerform.email,
      });

      // Clear registration form
      setregisterform({
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Switch to login tab after a short delay
      setTimeout(() => {
        setActiveTab("login");
        setSuccessMessage(""); // Clear success message after switching
      }, 2000);

    } catch (error: any) {
      setLoading(false);
      setErrorMessage(error.message || "Error creating account. Please try again.");
      console.error("error creating account:", error);
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center h={400}>
          <Stack align="center" gap="md">
            <Title order={2}>Loading...</Title>
            <Loader size="lg" />
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size={420} my={60}>
      <Title
        ta="center"
        order={1}
        style={{
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
        }}
      >
        Welcome Back
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Tabs
          value={activeTab}
          onChange={(value) => {
            setActiveTab(value as "login" | "signup");
            setErrorMessage("");
            setSuccessMessage("");
          }}
        >
          <Tabs.List grow>
            <Tabs.Tab value="login">Login</Tabs.Tab>
            <Tabs.Tab value="signup">Sign Up</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login" pt="xs">
            {successMessage && (
              <Alert
                icon={<IconCheck size={16} />}
                color="green"
                mt="md"
                onClose={() => setSuccessMessage("")}
                withCloseButton
              >
                {successMessage}
              </Alert>
            )}

            {errorMessage && activeTab === "login" && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                mt="md"
                onClose={() => setErrorMessage("")}
                withCloseButton
              >
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              <TextInput
                label="Email"
                placeholder="you@email.com"
                required
                mt="md"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />
              <Checkbox
                label="Remember me"
                mt="md"
                checked={loginForm.rememberMe}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, rememberMe: e.target.checked })
                }
              />
              <Button fullWidth mt="xl" type="submit" onClick={handleLogin}>
                Sign in
              </Button>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="signup" pt="xs">
            {successMessage && (
              <Alert
                icon={<IconCheck size={16} />}
                color="green"
                mt="md"
              >
                {successMessage}
              </Alert>
            )}

            {errorMessage && activeTab === "signup" && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                mt="md"
                onClose={() => setErrorMessage("")}
                withCloseButton
              >
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              <TextInput
                label="Email"
                placeholder="you@email.com"
                required
                mt="md"
                value={registerform.email}
                onChange={(e) =>
                  setregisterform({ ...registerform, email: e.target.value })
                }
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                value={registerform.password}
                onChange={(e) =>
                  setregisterform({ ...registerform, password: e.target.value })
                }
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm password"
                required
                mt="md"
                value={registerform.confirmPassword}
                onChange={(e) =>
                  setregisterform({
                    ...registerform,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <Button fullWidth mt="xl" type="submit" onClick={handleRegister}>
                Create account
              </Button>
            </form>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}