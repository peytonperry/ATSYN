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
} from "@mantine/core";
import { Navigate, useNavigate } from "react-router-dom";
import { apiService } from "../config/api";
import { useAuth } from "../components/Auth/AuthContext";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

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
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      const loginData: LoginDto = {
        email: loginForm.email,
        password: loginForm.password,
        rememberMe: loginForm.rememberMe,
      };
      const data = await apiService.post("/controller/login", loginData);
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
      console.error("error logging in:", error);
    }
  };
  const handleRegister = async () => {
    try {
      const registerData: RegisterDto = {
        email: registerform.email,
        password: registerform.password,
      };
      const data = await apiService.post("/auth/register", registerData);
    } catch (error: any) {
      console.error("error creating account:", error);
    }
  };
  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center h={400}>
          <Stack align="center" gap="md">
            <Title order={2}>Logging In...</Title>
            <Loader size="lg" />
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size={420} my={60}>
      <Title
        text-align="center"
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
          onChange={(value) => setActiveTab(value as "login" | "signup")}
        >
          <Tabs.List grow>
            <Tabs.Tab value="login">Login</Tabs.Tab>
            <Tabs.Tab value="signup">Sign Up</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login" pt="xs">
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
            <form onSubmit={(e) => e.preventDefault()}>
              <TextInput label="Name" placeholder="John Doe" required mt="md" />
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
