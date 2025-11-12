import { useEffect, useState } from "react";
import { apiService } from "../../../config/api";
import { Badge, Container, Group, Paper, Stack, Text } from "@mantine/core";

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
  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        {contacts.map((contact) => (
            <Paper key={contact.id} withBorder p="md" radius="md">
              <Group justify="space-between" mb="xs">
                <div>
                  <Text fw={700}>{contact.subject}</Text>
                  <Text size="sm" c="dimmed">
                    From: {contact.name} ({contact.email})
                  </Text>
                </div>
                <div>
                  <Badge color={contact.isRead ? "green" : "red"}>
                    {contact.isRead ? "Read" : "Unread"}
                  </Badge>
                  <Text size="xs" c="dimmed" mt="xs">
                    {new Date(contact.submittedAt).toLocaleDateString()}
                  </Text>
                </div>
              </Group>
            </Paper>
        ))}
      </Stack>
    </Container>
  );
}
export default AdminContacts;
