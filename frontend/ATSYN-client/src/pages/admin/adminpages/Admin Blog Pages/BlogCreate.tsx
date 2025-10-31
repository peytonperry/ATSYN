import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, TextInput, Button, Paper, Stack } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Link } from '@mantine/tiptap';
import { apiService } from '../../../../config/api';

interface CreateNewsDto {
  title: string;
  content: string;
}

export function CreateNewsForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!editor) return;

    const htmlContent = editor.getHTML();
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (htmlContent === '<p></p>' || !htmlContent.trim()) {
      setError('Please enter some content');
      return;
    }

    setLoading(true);

    const newPost: CreateNewsDto = {
      title: title.trim(),
      content: htmlContent,
    };

    try {
      await apiService.post('/news', newPost);
      
      setTitle('');
      //editor.commands.setContent('');
      
      //alert('News post created successfully!');
      navigate('/blog');
      
    } catch (error) {
      console.error('Error creating news:', error);
      setError('Failed to create news post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Title order={2}>Create News Post</Title>

            {error && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#ff6b6b', 
                color: 'white', 
                borderRadius: '4px' 
              }}>
                {error}
              </div>
            )}

            <TextInput
              label="Title"
              placeholder="Enter news title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
              disabled={loading}
            />

            <div>
              <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>
                Content
              </label>
              <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content style={{ minHeight: '300px' }} />
              </RichTextEditor>
            </div>

            <Button type="submit" loading={loading}>
              Create Post
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateNewsForm;