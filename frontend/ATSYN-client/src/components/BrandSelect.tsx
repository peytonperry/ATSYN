import { useState } from "react";
import { Combobox, useCombobox, InputBase, Loader } from "@mantine/core";

interface Brand {
  id: number;
  name: string;
}

interface BrandSelectProps {
  brands: Brand[];
  value: number | null;
  onBrandChange: (brand: Brand) => void;
  onBrandCreate: (brandName: string) => Promise<Brand>;
}

export function BrandSelect({
  brands,
  value,
  onBrandChange,
  onBrandCreate,
}: BrandSelectProps) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const selectedBrand = brands.find((b) => b.id === value);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const exactMatch = brands.find(
    (brand) => brand.name.toLowerCase() === search.toLowerCase().trim()
  );

  const handleCreateBrand = async () => {
    if (!search.trim() || exactMatch) return;

    setLoading(true);
    try {
      const newBrand = await onBrandCreate(search.trim());
      onBrandChange(newBrand);
      setSearch("");
      combobox.closeDropdown();
    } catch (error) {
      console.error("Error creating brand:", error);
    } finally {
      setLoading(false);
    }
  };

  const options = filteredBrands.map((brand) => (
    <Combobox.Option value={brand.id.toString()} key={brand.id}>
      {brand.name}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        if (val === "$create") {
          handleCreateBrand();
        } else {
          const brand = brands.find((b) => b.id === parseInt(val));
          if (brand) {
            onBrandChange(brand);
            setSearch("");
            combobox.closeDropdown();
          }
        }
      }}
    >
      <Combobox.Target>
        <InputBase
          label="Brand (Optional)"
          placeholder="Search or create brand"
          value={search || selectedBrand?.name || ""}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch("");
          }}
          rightSection={loading ? <Loader size={18} /> : null}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}
          {search.trim() && !exactMatch && (
            <Combobox.Option value="$create">
              + Create "{search.trim()}"
            </Combobox.Option>
          )}
          {filteredBrands.length === 0 && !search.trim() && (
            <Combobox.Empty>No brands found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}