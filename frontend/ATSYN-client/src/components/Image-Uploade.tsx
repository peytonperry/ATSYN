import { FileInput, Container, Paper, Button, Stack, TextInput, Checkbox, NumberInput, Alert } from '@mantine/core';
import { useState } from 'react';
import { apiService } from '../config/api';

interface ImageUploadProps {
  productId?: number;
}

function ImageUpload({ productId = 1 }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleDisplayOrderChange = (value: string | number) => {
    if (typeof value === 'string') {
      setDisplayOrder(parseInt(value) || 0);
    } else {
      setDisplayOrder(value || 0);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('ProductId', productId.toString());
    formData.append('IsPrimary', isPrimary.toString());
    formData.append('DisplayOrder', displayOrder.toString());
    formData.append('AltText', altText);
    formData.append('File', file);

    try {
      const result = await apiService.uploadFile('/Photo/upload', formData);
      setMessage({ text: 'Photo uploaded successfully!', type: 'success' });
      
      // Reset form
      setFile(null);
      setAltText('');
      setIsPrimary(false);
      setDisplayOrder(0);
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Failed to upload photo', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <Paper p="md">
        <Stack gap="md">
          {message && (
            <Alert 
              color={message.type === 'success' ? 'green' : 'red'}
              withCloseButton
              onClose={() => setMessage(null)}
            >
              {message.text}
            </Alert>
          )}
          
          <FileInput
            size="md"
            radius="md"
            label="Upload Image"
            accept="image/jpeg, image/jpg, image/png, image/gif, image/webp"
            value={file}
            onChange={setFile}
            clearable
          />
          
          <Checkbox
            label="Set as primary photo"
            checked={isPrimary}
            onChange={(event) => setIsPrimary(event.currentTarget.checked)}
          />
          
          <NumberInput
            label="Display Order"
            value={displayOrder}
            onChange={handleDisplayOrderChange}
            min={0}
          />
          
          <TextInput
            label="Alt Text"
            value={altText}
            onChange={(event) => setAltText(event.currentTarget.value)}
            placeholder="Describe the image for accessibility"
          />
          
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            loading={uploading}
          >
            Upload Photo
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default ImageUpload;