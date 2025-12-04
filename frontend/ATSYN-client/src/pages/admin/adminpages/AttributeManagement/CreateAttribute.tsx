import { useEffect, useState } from "react";
import {
  Container,
  TextInput,
  Button,
  Stack,
  Group,
  Title,
  Alert,
  Paper,
  Select,
  Checkbox,
  NumberInput,
  ActionIcon,
  Text,
} from "@mantine/core";
import {
  IconCheck,
  IconAlertCircle,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../../../config/api";

interface Category {
  id: number;
  name: string;
}

interface AttributeOption {
  value: string;
  displayOrder: number;
}

const CreateAttribute = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "select",
    categoryId: 0,
    isRequired: false,
    displayOrder: 0,
  });

  const [options, setOptions] = useState<AttributeOption[]>([
    { value: "", displayOrder: 0 },
  ]);

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
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const addOption = () => {
    setOptions([...options, { value: "", displayOrder: options.length }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (
    index: number,
    field: "value" | "displayOrder",
    value: string | number
  ) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (formData.categoryId === 0) {
      setErrorMsg("Please select a category");
      setLoading(false);
      return;
    }

    if (
      formData.type === "select" &&
      options.some((opt) => !opt.value.trim())
    ) {
      setErrorMsg("All options must have a value");
      setLoading(false);
      return;
    }

    const attributeData = {
      ...formData,
      options:
        formData.type === "select"
          ? options.filter((opt) => opt.value.trim())
          : [],
    };

    try {
      const response = await apiService.post(
        "/ProductAttribute",
        attributeData
      );
      console.log("Created attribute:", response);
      setSuccessMsg("Attribute created successfully!");

      setFormData({
        name: "",
        type: "select",
        categoryId: 0,
        isRequired: false,
        displayOrder: 0,
      });
      setOptions([{ value: "", displayOrder: 0 }]);

      setTimeout(() => {
        navigate("/admin/manage-attributes");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating attribute:", error);
      setErrorMsg(
        error.response?.data || "Failed to create attribute. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Button
        variant="subtle"
        onClick={() => navigate("/admin/manage-attributes")}
        mb="md"
      >
        ← Back to Manage Attributes
      </Button>

      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="xl">
          Create Product Attribute
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Select
              label="Category"
              placeholder="Select a category"
              data={categories.map((cat) => ({
                value: cat.id.toString(),
                label: cat.name,
              }))}
              value={
                formData.categoryId > 0 ? formData.categoryId.toString() : null
              }
              onChange={(value) =>
                setFormData({ ...formData, categoryId: parseInt(value || "0") })
              }
              required
              searchable
            />

            <TextInput
              label="Attribute Name"
              placeholder="e.g., Size, Color, Material"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.currentTarget.value })
              }
            />

            <Select
              label="Attribute Type"
              data={[
                { value: "select", label: "Select (Dropdown)" },
                { value: "text", label: "Text Input" },
                { value: "number", label: "Number Input" },
              ]}
              value={formData.type}
              onChange={(value) =>
                setFormData({ ...formData, type: value || "select" })
              }
              required
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
              label="Required Field"
              description="Users must provide a value for this attribute when creating a product"
              checked={formData.isRequired}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isRequired: e.currentTarget.checked,
                })
              }
            />

            {formData.type === "select" && (
              <>
                <Group justify="space-between" mt="md">
                  <Text fw={500}>Attribute Options</Text>
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
                  {options.map((option, index) => (
                    <Group key={index} gap="xs" align="flex-end">
                      <TextInput
                        placeholder="Option value (e.g., 1.5oz, Small, Red)"
                        value={option.value}
                        onChange={(e) =>
                          updateOption(index, "value", e.currentTarget.value)
                        }
                        style={{ flex: 1 }}
                        required
                      />
                      <NumberInput
                        placeholder="Order"
                        value={option.displayOrder}
                        onChange={(value) =>
                          updateOption(
                            index,
                            "displayOrder",
                            Number(value) || 0
                          )
                        }
                        style={{ width: 100 }}
                        min={0}
                      />
                      {options.length > 1 && (
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
              Create Attribute
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateAttribute;
