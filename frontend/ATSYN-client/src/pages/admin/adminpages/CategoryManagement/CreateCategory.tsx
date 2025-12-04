import { useEffect, useState } from "react";
import {
  Container,
  TextInput,
  Button,
  Stack,
  Title,
  Alert,
  Paper,
  Select,
  NumberInput,
  Checkbox,
  Textarea,
} from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../../../config/api";

interface Category {
  id: number;
  name: string;
  parentCategoryId?: number | null;
}

const CreateCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategoryId: null as number | null,
    displayOrder: 0,
    isActive: true,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get("/Category");
        const fetchedCategories: Category[] = response || [];
        setCategories(fetchedCategories.filter((c) => !c.parentCategoryId));
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await apiService.post("/Category", formData);
      console.log("Created category:", response);
      setSuccessMsg("Category created successfully!");

      setFormData({
        name: "",
        description: "",
        parentCategoryId: null,
        displayOrder: 0,
        isActive: true,
      });

      setTimeout(() => {
        navigate("/admin/manage-categories");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating category:", error);
      setErrorMsg(
        error.response?.data || "Failed to create category. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Button
        variant="subtle"
        onClick={() => navigate("/admin/manage-categories")}
        mb="md"
      >
        ← Back to Manage Categories
      </Button>

      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="xl">
          Create Category
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Category Name"
              placeholder="e.g., Needle Cartridges, Round Liners, Inks"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.currentTarget.value })
              }
            />

            <Textarea
              label="Description"
              placeholder="Brief description of the category"
              minRows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.currentTarget.value })
              }
            />

            <Select
              label="Parent Category"
              placeholder="None (This will be a root category)"
              description="Select a parent category to create a subcategory"
              data={categories.map((cat) => ({
                value: cat.id.toString(),
                label: cat.name,
              }))}
              value={formData.parentCategoryId?.toString() || null}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  parentCategoryId: value ? parseInt(value) : null,
                })
              }
              clearable
              searchable
            />

            <NumberInput
              label="Display Order"
              placeholder="0"
              description="Lower numbers appear first"
              min={0}
              value={formData.displayOrder}
              onChange={(value) =>
                setFormData({ ...formData, displayOrder: Number(value) || 0 })
              }
            />

            <Checkbox
              label="Active"
              description="Only active categories will be visible"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.currentTarget.checked })
              }
            />

            {successMsg && (
              <Alert
                icon={<IconCheck size={16} />}
                color="green"
                withCloseButton
                onClose={() => setSuccessMsg("")}
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
              >
                {errorMsg}
              </Alert>
            )}

            <Button type="submit" loading={loading} fullWidth size="lg" mt="md">
              Create Category
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateCategory;
