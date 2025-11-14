import { useState, useEffect } from "react";
import { Select, Stack } from "@mantine/core";

interface Category {
  id: number;
  name: string;
  parentCategoryId?: number | null;
  subCategories?: Category[];
}

interface CategorySelectProps {
  categories: Category[];
  onCategoryChange: (category: Category) => void;
  onCategoryCreate?: (name: string) => Promise<Category>;
  selectedCategoryId?: number;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  onCategoryChange,
  onCategoryCreate,
  selectedCategoryId,
}) => {
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  const parentCategories = categories.filter((c) => !c.parentCategoryId);
  const childCategories = selectedParent
    ? categories.filter((c) => c.parentCategoryId === selectedParent)
    : [];

  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find((c) => c.id === selectedCategoryId);
      if (category) {
        if (category.parentCategoryId) {
          setSelectedParent(category.parentCategoryId);
          setSelectedChild(category.id);
        } else {
          setSelectedParent(category.id);
          setSelectedChild(null);
        }
      }
    }
  }, [selectedCategoryId, categories]);

  const handleParentChange = (value: string | null) => {
    const parentId = value ? parseInt(value) : null;
    setSelectedParent(parentId);
    setSelectedChild(null);

    if (parentId) {
      const parent = categories.find((c) => c.id === parentId);
      const hasChildren = categories.some(
        (c) => c.parentCategoryId === parentId
      );

      if (!hasChildren && parent) {
        onCategoryChange(parent);
      }
    }
  };

  const handleChildChange = (value: string | null) => {
    const childId = value ? parseInt(value) : null;
    setSelectedChild(childId);

    if (childId) {
      const child = categories.find((c) => c.id === childId);
      if (child) {
        onCategoryChange(child);
      }
    }
  };

  return (
    <Stack gap="sm">
      <Select
        label="Category"
        placeholder="Select a category"
        data={parentCategories.map((cat) => ({
          value: cat.id.toString(),
          label: cat.name,
        }))}
        value={selectedParent?.toString() || null}
        onChange={handleParentChange}
        searchable
        clearable
        required
      />

      {selectedParent && childCategories.length > 0 && (
        <Select
          label="Subcategory"
          placeholder="Select a subcategory"
          data={childCategories.map((cat) => ({
            value: cat.id.toString(),
            label: cat.name,
          }))}
          value={selectedChild?.toString() || null}
          onChange={handleChildChange}
          searchable
          clearable
          required
        />
      )}
    </Stack>
  );
};
