import { Avatar, Badge, Card, Container, Divider, Grid, Group, Loader, Stack, Text, Title } from "@mantine/core";
import "./AdminProfile.css";
import { apiService } from "../../../config/api";
import { useEffect, useState } from "react";

interface Admin {
  id: number;
  email: string;
  userName: string;
  role: string;
  emailConfirmed: boolean;
}

const AdminProfile    = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);;
  
  const handleFileChange = (newFile:any) => {
    setFile(newFile)
    if(newFile){
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(newFile)
    }
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await apiService.get("/Auth/profile")
        console.log("Profile data received:", response);
        setAdmin(response);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  if (loading) {
    return (
      <Group  align="center" style={{ height: "100vh" }}>
        <Loader size="xl" variant="dots" />
      </Group>
    );
  }



return (
  <div className="admin-profile-container">
    <Container size="xl" py="xl">
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <Card shadow="md" padding="xl" radius="lg" withBorder className="profile-card">
              <Group justify="center" mb="md">
                <Avatar
                  src={admin?.userName || "EX"}
                  alt={admin?.userName || "EX"}
                  size={120}
                  radius={120}
                  className="profile-avatar"
                >
                  {admin?.userName.slice(0, 2).toUpperCase() || "EX"}
                </Avatar>
              </Group>

              <Stack align="center" gap="xs" mb="md">
                <Title order={2}>{admin?.userName}</Title>
                <Text c="white" size="sm" >
                  {admin?.email}
                </Text>
                <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                  Administrator
                </Badge>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Card shadow="sm" padding="lg" radius="lg" withBorder>
              <Title order={4} mb="md">Account Information</Title>
              <Divider mb="md" />
              
              <Stack gap="md">
                <Group justify="apart">
                  <Text fw={500} size="sm">Username</Text>
                  <Text c="dimmed" size="sm">{admin?.userName}</Text>
                </Group>
                
                <Group justify="apart">
                  <Text fw={500} size="sm">Email Address</Text>
                  <Text c="dimmed" size="sm">{admin?.email}</Text>
                </Group>
                
                <Group justify="apart">
                  <Text fw={500} size="sm">Role</Text>
                  <Badge variant="light" color="blue">Admin</Badge>
                </Group>

                <Group justify="apart">
                  <Text fw={500} size="sm">Account Status</Text>
                  <Badge variant="light" color="green">Active</Badge>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  </div>
);
};

export default AdminProfile;
