import { useEffect, useState } from "react";
import { apiService } from "../../../config/api";
import {
  Badge,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: Date;
  isRead: boolean;
}

function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const contactData: Contact[] = await apiService.get("/Contact");
      setContacts(contactData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contact list:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  });

  const markAsRead = (id: number) => {
    

  }
  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        {contacts.map((contact) => (
          <Paper key={contact.id} withBorder p="md" radius="md" shadow="sm">
            <Group justify="space-between" mb="sm" wrap="wrap">
              <Group gap="xs" wrap="wrap">
                <Badge component="button" onClick={markAsRead(contact.id)} color={contact.isRead ? "green" : "red"}>
                  {contact.isRead ? "Read" : "Unread"}
                </Badge>
                <Text size="sm" c="dimmed">
                  {new Date(contact.submittedAt).toLocaleDateString()}
                </Text>
              </Group>
            </Group>

            <Stack gap="xs">
              <Text fw={700} size="lg">
                {contact.subject}
              </Text>
              <Group gap="md" wrap="wrap">
                <Group gap="xs">
                  <Text size="sm" c="dimmed" fw={500}>
                    From:
                  </Text>
                  <Text size="sm">{contact.name}</Text>
                </Group>

                <Group gap="xs">
                  <Text size="sm" c="dimmed" fw={500}>
                    Email:
                  </Text>
                  <Text size="sm">{contact.email}</Text>
                </Group>
              </Group>

              <Divider my="xs" />

              <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                {contact.message}
              </Text>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
export default AdminContacts;
