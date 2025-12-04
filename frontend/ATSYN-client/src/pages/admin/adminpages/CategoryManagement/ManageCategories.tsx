import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Paper,
  Table,
  Button,
  Group,
  Badge,
  Modal,
  TextInput,
  Select,
  Stack,
  ActionIcon,
  Text,
  Alert,
  NumberInput,
  Checkbox,
} from "@mantine/core";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconCheck,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../../../config/api";

interface Category {
  id: number;
  name: string;
  description: string;
  parentCategoryId?: number | null;
  parentCategoryName?: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface EditCategoryData {
  name: string;
  description: string;
  parentCategoryId?: number | null;
  displayOrder: number;
  isActive: boolean;
}

const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [editFormData, setEditFormData] = useState<EditCategoryData>({
    name: "",
    description: "",
    parentCategoryId: null,
    displayOrder: 0,
    isActive: true,
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiService.get("/Category");
      setCategories(response || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await apiService.delete(`/Category/${categoryToDelete}`);
      setSuccessMsg("Category deleted successfully");
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      setErrorMsg(error.response?.data || "Failed to delete category");
      setDeleteModalOpen(false);
    }
  };

  const openEditModal = (category: Category) => {
    setCategoryToEdit(category);
    setEditFormData({
      name: category.name,
      description: category.description,
      parentCategoryId: category.parentCategoryId,
      displayOrder: category.displayOrder,
      isActive: category.isActive,
    });
    setEditModalOpen(true);
  };

  const handleEdit = async () => {
    if (!categoryToEdit) return;

    try {
      await apiService.put(`/Category/${categoryToEdit.id}`, editFormData);
      setSuccessMsg("Category updated successfully");
      setEditModalOpen(false);
      setCategoryToEdit(null);
      fetchCategories();
    } catch (error: any) {
      console.error("Error updating category:", error);
      setErrorMsg(error.response?.data || "Failed to update category");
    }
  };

  const parentCategories = categories.filter((c) => !c.parentCategoryId);

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Manage Categories</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate("/admin/create-category")}
        >
          Create New Category
        </Button>
      </Group>

      {successMsg && (
        <Alert
          icon={<IconCheck size={16} />}
          color="green"
          withCloseButton
          onClose={() => setSuccessMsg("")}
          mb="md"
        >
          {successMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          withCloseButton
          onClose={() => setErrorMsg("")}
          mb="md"
        >
          {errorMsg}
        </Alert>
      )}

      <Paper shadow="sm" p="md" withBorder>
        {loading ? (
          <Text>Loading...</Text>
        ) : categories.length === 0 ? (
          <Text c="dimmed">
            No categories found. Create your first category to get started.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Parent Category</Table.Th>
                <Table.Th>Display Order</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {categories.map((category) => (
                <Table.Tr key={category.id}>
                  <Table.Td>
                    <Text fw={category.parentCategoryId ? 400 : 600}>
                      {category.parentCategoryId && "→ "}
                      {category.name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" lineClamp={2}>
                      {category.description || "-"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {category.parentCategoryName ? (
                      <Badge variant="light">
                        {category.parentCategoryName}
                      </Badge>
                    ) : (
                      <Text size="sm" c="dimmed">
                        Root Category
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>{category.displayOrder}</Table.Td>
                  <Table.Td>
                    {category.isActive ? (
                      <Badge color="green">Active</Badge>
                    ) : (
                      <Badge color="gray">Inactive</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => openEditModal(category)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => {
                          setCategoryToDelete(category.id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Category"
        centered
      >
        <Text>
          Are you sure you want to delete this category? This action cannot be
          undone.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Category"
        size="lg"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Category Name"
            placeholder="e.g., Round Liners"
            value={editFormData.name}
            onChange={(e) =>
              setEditFormData({ ...editFormData, name: e.currentTarget.value })
            }
            required
          />

          <TextInput
            label="Description"
            placeholder="Brief description of the category"
            value={editFormData.description}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                description: e.currentTarget.value,
              })
            }
          />

          <Select
            label="Parent Category"
            placeholder="None (Root Category)"
            data={[
              { value: "", label: "None (Root Category)" },
              ...parentCategories
                .filter((c) => c.id !== categoryToEdit?.id)
                .map((cat) => ({
                  value: cat.id.toString(),
                  label: cat.name,
                })),
            ]}
            value={editFormData.parentCategoryId?.toString() || ""}
            onChange={(value) =>
              setEditFormData({
                ...editFormData,
                parentCategoryId: value ? parseInt(value) : null,
              })
            }
            clearable
          />

          <NumberInput
            label="Display Order"
            placeholder="0"
            description="Lower numbers appear first"
            min={0}
            value={editFormData.displayOrder}
            onChange={(value) =>
              setEditFormData({
                ...editFormData,
                displayOrder: Number(value) || 0,
              })
            }
          />

          <Checkbox
            label="Active"
            checked={editFormData.isActive}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                isActive: e.currentTarget.checked,
              })
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default ManageCategories;
