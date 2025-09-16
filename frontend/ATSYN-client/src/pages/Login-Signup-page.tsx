import { useState } from "react";
import {
  Container,
  Paper,
  Tabs,
  TextInput,
  PasswordInput,
  Button,
  Title,
} from "@mantine/core";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

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
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
              />
              <Button fullWidth mt="xl" type="submit">
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
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm password"
                required
                mt="md"
              />
              <Button fullWidth mt="xl" type="submit">
                Create account
              </Button>
            </form>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}
