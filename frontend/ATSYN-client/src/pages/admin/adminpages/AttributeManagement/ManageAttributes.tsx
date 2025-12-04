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
  Checkbox,
  NumberInput,
  Stack,
  ActionIcon,
  Text,
  Alert,
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
}

interface AttributeOption {
  id: number;
  value: string;
  displayOrder: number;
}

interface ProductAttribute {
  id: number;
  name: string;
  type: string;
  categoryId: number;
  isRequired: boolean;
  displayOrder: number;
  options: AttributeOption[];
}

interface EditAttributeData {
  name: string;
  type: string;
  isRequired: boolean;
  displayOrder: number;
  options: { value: string; displayOrder: number }[];
}

const ManageAttributes = () => {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState<number | null>(
    null
  );
  const [attributeToEdit, setAttributeToEdit] =
    useState<ProductAttribute | null>(null);
  const [editFormData, setEditFormData] = useState<EditAttributeData>({
    name: "",
    type: "select",
    isRequired: false,
    displayOrder: 0,
    options: [],
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchAttributes();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchAttributesByCategory(parseInt(selectedCategory));
    } else {
      fetchAttributes();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.get("/Category");
      setCategories(response || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const response = await apiService.get("/ProductAttribute");
      setAttributes(response || []);
    } catch (error) {
      console.error("Error fetching attributes:", error);
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttributesByCategory = async (categoryId: number) => {
    setLoading(true);
    try {
      const response = await apiService.get(
        `/ProductAttribute/category/${categoryId}`
      );
      setAttributes(response || []);
    } catch (error) {
      console.error("Error fetching attributes:", error);
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!attributeToDelete) return;

    try {
      await apiService.delete(`/ProductAttribute/${attributeToDelete}`);
      setSuccessMsg("Attribute deleted successfully");
      setDeleteModalOpen(false);
      setAttributeToDelete(null);
      if (selectedCategory) {
        fetchAttributesByCategory(parseInt(selectedCategory));
      } else {
        fetchAttributes();
      }
    } catch (error) {
      console.error("Error deleting attribute:", error);
      setErrorMsg("Failed to delete attribute");
    }
  };

  const openEditModal = (attribute: ProductAttribute) => {
    setAttributeToEdit(attribute);
    setEditFormData({
      name: attribute.name,
      type: attribute.type,
      isRequired: attribute.isRequired,
      displayOrder: attribute.displayOrder,
      options: attribute.options.map((opt) => ({
        value: opt.value,
        displayOrder: opt.displayOrder,
      })),
    });
    setEditModalOpen(true);
  };

  const handleEdit = async () => {
    if (!attributeToEdit) return;

    try {
      await apiService.put(
        `/ProductAttribute/${attributeToEdit.id}`,
        editFormData
      );
      setSuccessMsg("Attribute updated successfully");
      setEditModalOpen(false);
      setAttributeToEdit(null);
      if (selectedCategory) {
        fetchAttributesByCategory(parseInt(selectedCategory));
      } else {
        fetchAttributes();
      }
    } catch (error) {
      console.error("Error updating attribute:", error);
      setErrorMsg("Failed to update attribute");
    }
  };

  const addOption = () => {
    setEditFormData({
      ...editFormData,
      options: [
        ...editFormData.options,
        { value: "", displayOrder: editFormData.options.length },
      ],
    });
  };

  const removeOption = (index: number) => {
    setEditFormData({
      ...editFormData,
      options: editFormData.options.filter((_, i) => i !== index),
    });
  };

  const updateOption = (
    index: number,
    field: "value" | "displayOrder",
    value: string | number
  ) => {
    const updatedOptions = [...editFormData.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setEditFormData({ ...editFormData, options: updatedOptions });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Manage Product Attributes</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate("/admin/create-attribute")}
        >
          Create New Attribute
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

      <Paper shadow="sm" p="md" mb="xl" withBorder>
        <Select
          label="Filter by Category"
          placeholder="All Categories"
          data={[
            { value: "", label: "All Categories" },
            ...categories.map((cat) => ({
              value: cat.id.toString(),
              label: cat.name,
            })),
          ]}
          value={selectedCategory}
          onChange={setSelectedCategory}
          clearable
        />
      </Paper>

      <Paper shadow="sm" p="md" withBorder>
        {loading ? (
          <Text>Loading...</Text>
        ) : attributes.length === 0 ? (
          <Text c="dimmed">
            No attributes found. Create your first attribute to get started.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Required</Table.Th>
                <Table.Th>Options</Table.Th>
                <Table.Th>Display Order</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {attributes.map((attr) => (
                <Table.Tr key={attr.id}>
                  <Table.Td>{attr.name}</Table.Td>
                  <Table.Td>
                    <Badge variant="light">
                      {getCategoryName(attr.categoryId)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{attr.type}</Table.Td>
                  <Table.Td>
                    {attr.isRequired ? (
                      <Badge color="red">Required</Badge>
                    ) : (
                      <Badge color="gray">Optional</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {attr.options.length > 0 ? (
                      <Text size="sm">
                        {attr.options.map((opt) => opt.value).join(", ")}
                      </Text>
                    ) : (
                      <Text size="sm" c="dimmed">
                        No options
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>{attr.displayOrder}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => openEditModal(attr)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => {
                          setAttributeToDelete(attr.id);
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
        title="Delete Attribute"
        centered
      >
        <Text>
          Are you sure you want to delete this attribute? This action cannot be
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
        title="Edit Attribute"
        size="lg"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Attribute Name"
            placeholder="e.g., Size"
            value={editFormData.name}
            onChange={(e) =>
              setEditFormData({ ...editFormData, name: e.currentTarget.value })
            }
            required
          />

          <Select
            label="Type"
            data={[
              { value: "select", label: "Select (Dropdown)" },
              { value: "text", label: "Text Input" },
              { value: "number", label: "Number Input" },
            ]}
            value={editFormData.type}
            onChange={(value) =>
              setEditFormData({ ...editFormData, type: value || "select" })
            }
            required
          />

          <NumberInput
            label="Display Order"
            placeholder="0"
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
            label="Required Field"
            checked={editFormData.isRequired}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                isRequired: e.currentTarget.checked,
              })
            }
          />

          {editFormData.type === "select" && (
            <>
              <Group justify="space-between" mt="md">
                <Text fw={500} size="sm">
                  Options
                </Text>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<IconPlus size={14} />}
                  onClick={addOption}
                >
                  Add Option
                </Button>
              </Group>

              <Stack gap="xs">
                {editFormData.options.map((option, index) => (
                  <Group key={index} gap="xs" align="flex-end">
                    <TextInput
                      placeholder="Option value (e.g., 1.5oz, Small, Red)"
                      value={option.value}
                      onChange={(e) =>
                        updateOption(index, "value", e.currentTarget.value)
                      }
                      style={{ flex: 1 }}
                    />
                    <NumberInput
                      placeholder="Order"
                      value={option.displayOrder}
                      onChange={(value) =>
                        updateOption(index, "displayOrder", Number(value) || 0)
                      }
                      style={{ width: 100 }}
                      min={0}
                    />
                    {editFormData.options.length > 1 && (
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => removeOption(index)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                ))}
              </Stack>
            </>
          )}

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

export default ManageAttributes;
