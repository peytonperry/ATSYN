import React, { useEffect, useState } from "react";
import { Combobox, useCombobox, TextInput } from "@mantine/core";

interface Category {
  id: number;
  name: string;
}

interface CategorySelectProps{
  categories: Category[];
  onCategoryChange: (category: Category) => void;
  onCategoryCreate?: (newCategoryName: string) => Promise<Category>
}


const CategorySelect: React.FC<CategorySelectProps> = ({
  categories, 
  onCategoryChange, 
  onCategoryCreate
}) => {
    const [data, setData] = useState<Category[]>(categories || []);
    const [value, setValue] = useState("");
    const comboBox = useCombobox();

    useEffect(() => {
        console.log("Categories updated:", categories);
        setData(categories || []);
    }, [categories]);

    const handleCreateCategory = async (categoryName: string) => {
        console.log("Creating new category:", categoryName);
        try {
            if (onCategoryCreate) {
                const newCategory = await onCategoryCreate(categoryName); 
                console.log("Created category:", newCategory);
                setData([...data, newCategory]);
                setValue(newCategory.name);
                onCategoryChange(newCategory);
            }
        } catch (error) {
            console.error("Error creating category:", error);
        }
        comboBox.closeDropdown();
    };

    const handleOptionSelect = (categoryName: string) => {
        console.log("Option selected:", categoryName);
        const existingCategory = data.find(
            category => category.name.toLowerCase() === categoryName.toLowerCase()
        );
        
        if (existingCategory) {
            console.log("Found existing category:", existingCategory);
            onCategoryChange(existingCategory);
            setValue(existingCategory.name);
            comboBox.closeDropdown();
        } else {
            console.log("Category doesn't exist, creating...");
            handleCreateCategory(categoryName);
        }
    };

    return (
        <Combobox
            store={comboBox}
            onOptionSubmit={handleOptionSelect}
        >
            <Combobox.Target>
                <TextInput
                    placeholder="Select or create category"
                    value={value}
                    onChange={(event) => {
                        setValue(event.currentTarget.value);
                        comboBox.openDropdown();
                        comboBox.updateSelectedOptionIndex();
                    }}
                    onClick={() => comboBox.openDropdown()}
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {data
                        .filter((category) =>
                            value === "" || 
                            category.name.toLowerCase().includes(value.toLowerCase())
                        )
                        .map((category) => (
                            <Combobox.Option key={category.id} value={category.name}>
                                {category.name}
                            </Combobox.Option>
                        ))
                    }
                    {value.trim() !== "" && 
                     !data.some(category => 
                         category.name.toLowerCase() === value.toLowerCase()
                     ) && (
                        <Combobox.Option value={value}>
                            + Create "{value}"
                        </Combobox.Option>
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};

export {CategorySelect};
