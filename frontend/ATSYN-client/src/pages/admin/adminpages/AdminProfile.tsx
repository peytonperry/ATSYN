import { Avatar, Card, Divider, Group, Image, Loader, Stack, Text, Title } from "@mantine/core";
import "./AdminProfile.css";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../../config/api";
import { use, useEffect, useState } from "react";

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
  //const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await apiService.get("/auth/profile")
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
      <Card shadow="md" padding="xl" radius="lg" withBorder className="admin-profile-card">
        <Group justify="center" mb="md">
          <Avatar
            src={admin?.userName || "CW"}
            alt={admin?.userName  || "CW"}
            size={100}
            radius={100}
          >
            {admin?.userName  || "CW"}
          </Avatar>
        </Group>

        <Stack align="center" gap="xs" mb="md">
          <Title order={2}>{"carringtonADMIN.test@gmail.com" }</Title>
          <Text c="dimmed" size="sm">
            {admin?.email}
          </Text>
          <Text className="admin-role">{ "Admin"}</Text>
        </Stack>

        <Divider my="md" />

      </Card>
    </div>
  );
};

export default AdminProfile;
