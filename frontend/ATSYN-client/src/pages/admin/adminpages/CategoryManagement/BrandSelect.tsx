import { useState } from "react";
import { Select, Group, TextInput, Button } from "@mantine/core";

interface Brand {
  id: number;
  name: string;
}

interface BrandSelectProps {
  brands: Brand[];
  value: number | null;
  onBrandChange: (brand: Brand | null) => void;
  onBrandCreate?: (brandName: string) => Promise<Brand>;
}

export const BrandSelect: React.FC<BrandSelectProps> = ({
  brands,
  value,
  onBrandChange,
  onBrandCreate,
}) => {
  const [newBrandName, setNewBrandName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateBrand = async () => {
    if (!newBrandName.trim() || !onBrandCreate) return;

    setCreating(true);
    try {
      const createdBrand = await onBrandCreate(newBrandName);
      onBrandChange(createdBrand);
      setNewBrandName("");
    } catch (error) {
      console.error("Error creating brand:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <Select
        label="Brand"
        placeholder="Select brand"
        data={brands.map((brand) => ({
          value: brand.id.toString(),
          label: brand.name,
        }))}
        value={value?.toString() || null}
        onChange={(val) => {
          if (val) {
            const brand = brands.find((b) => b.id.toString() === val);
            onBrandChange(brand || null);
          } else {
            onBrandChange(null);
          }
        }}
        searchable
        clearable
        nothingFoundMessage="Type to search brands"
      />
      {onBrandCreate && (
        <Group gap="xs" mt="xs">
          <TextInput
            placeholder="Or create new brand"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateBrand();
              }
            }}
            style={{ flex: 1 }}
          />
          <Button
            onClick={handleCreateBrand}
            loading={creating}
            disabled={!newBrandName.trim()}
          >
            Create
          </Button>
        </Group>
      )}
    </div>
  );
};
