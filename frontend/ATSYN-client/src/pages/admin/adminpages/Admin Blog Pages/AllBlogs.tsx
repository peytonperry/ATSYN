import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../../../config/api";
import {
  Container,
  Paper,
  Stack,
  Title,
  Button,
  Group,
  Badge,
  ActionIcon,
  Modal,
  Text,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface NewsPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

function AllBlogs() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: number; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data: NewsPost[] = await apiService.get("/news");
      setNews(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
    }
  };

  const openDeleteModal = (id: number, title: string) => {
    setPostToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    setDeleting(true);

    try {
      await apiService.delete(`/news/${postToDelete.id}`);
      setNews(news.filter((post) => post.id !== postToDelete.id));
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete blog post. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <>
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={1}>Manage Blogs</Title>
            <Button onClick={() => navigate("/admin/create-blog")}>
              Create New Blog
            </Button>
          </Group>

          <Stack gap="md">
            {news.map((newsPost) => (
              <Paper key={newsPost.id} shadow="sm" p="lg" withBorder>
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Title order={3}>{newsPost.title}</Title>
                    <Badge color="blue" variant="light" mt="xs">
                      {new Date(newsPost.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  <Group gap="xs">
                    <ActionIcon
                      color="blue"
                      variant="light"
                      size="lg"
                      onClick={() => navigate(`/admin/edit-blog/${newsPost.id}`)}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="light"
                      size="lg"
                      onClick={() => openDeleteModal(newsPost.id, newsPost.title)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </Container>

      {/* Custom Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        title="Delete Blog Post"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete <strong>"{postToDelete?.title}"</strong>?
          </Text>
          <Text size="sm" c="dimmed">
            This action cannot be undone.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDelete}
              loading={deleting}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default AllBlogs;