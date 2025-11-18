import { useEffect, useState } from "react";
import { apiService } from "../../../config/api";
import { TbTrash } from "react-icons/tb";
import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Divider,
  Group,
  Modal,
  Pagination,
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
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const [messagePage, setMessagePage] = useState(1);

  const messagesPerPage = 5;
  const totalMessagePages = contacts
    ? Math.ceil(contacts.length / messagesPerPage)
    : 0;
  const startIndex = (messagePage - 1) * messagesPerPage;
  const endIndex = startIndex + messagesPerPage;
  const paginatedContacts = contacts.slice(startIndex, endIndex) || [];

  const markAsRead = async (id: number) => {
    await apiService.put(`/Contact/toggle-read-unread/${id}`, {});
    fetchContacts();
  };

  const handleDeleteClick = (id: number) => {
    setContactToDelete(id);
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    if (contactToDelete === null) return;

    try {
      await apiService.delete(`/Contact/delete-contact/${contactToDelete}`);
      setDeleteModalOpened(false);
      setContactToDelete(null);
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

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
  }, []);

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        {paginatedContacts.map((contact) => (
          <Paper key={contact.id} withBorder p="md" radius="md" shadow="sm">
            <Group justify="space-between" mb="sm" wrap="wrap">
              <Group gap="xs" wrap="wrap">
                <Badge
                  component="button"
                  onClick={() => markAsRead(contact.id)}
                  color={contact.isRead ? "green" : "red"}
                >
                  {contact.isRead ? "Read" : "Unread"}
                </Badge>
                <Text size="sm" c="dimmed">
                  {new Date(contact.submittedAt).toLocaleDateString()}
                </Text>
              </Group>
              <ActionIcon
                color="red"
                onClick={() => handleDeleteClick(contact.id)}
              >
                <TbTrash />
              </ActionIcon>
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

        {paginatedContacts.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            No messages yet
          </Text>
        )}
      </Stack>
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Message"
        centered
      >
        <Text mb="md">
          Are you sure you want to delete this message? This action cannot be
          undone.
        </Text>

        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
      {totalMessagePages > 1 && (
        <Group mt="lg">
          <Pagination
            value={messagePage}
            onChange={setMessagePage}
            total={totalMessagePages}
          />
        </Group>
      )}
    </Container>
  );
}
export default AdminContacts;
