import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Paper, Stack, Title, Group, Modal, Container, Alert } from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Link } from '@mantine/tiptap';
import { apiService } from '../../../config/api';

interface CreateNewsDto {
  title: string;
  content: string;
}

interface UpdateNewsDto {
  title: string;
  content: string;
}

interface NewsDto {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface NewsFormProps {
  editingPost?: NewsDto;
  onSuccess?: () => void;
}

export function NewsForm({ editingPost, onSuccess }: NewsFormProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isEditMode = !!editingPost;

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

  // Load existing post data when editing
  useEffect(() => {
    if (editingPost && editor) {
      setTitle(editingPost.title);
      editor.commands.setContent(editingPost.content);
    }
  }, [editingPost, editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!editor) return;

    const htmlContent = editor.getHTML();
    
    if (!title.trim()) {
      setErrorMsg('Please enter a title');
      return;
    }

    if (htmlContent === '<p></p>' || !htmlContent.trim()) {
      setErrorMsg('Please enter some content');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // UPDATE existing post
        const updateData: UpdateNewsDto = {
          title: title.trim(),
          content: htmlContent,
        };

        await apiService.put(`/news/${editingPost.id}`, updateData);
        setSuccessMsg('Blog post updated successfully!');
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/admin/all-blogs');
          }
        }, 1500);
      } else {
        // CREATE new post
        const newPost: CreateNewsDto = {
          title: title.trim(),
          content: htmlContent,
        };

        await apiService.post('/news', newPost);
        setSuccessMsg('Blog post created successfully!');

        // Clear form only for new posts
        setTitle('');
        editor.commands.setContent('');
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/admin/all-blogs');
          }
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error with blog post:', error);
      setErrorMsg(`Failed to ${isEditMode ? 'update' : 'create'} blog post. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingPost) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await apiService.delete(`/news/${editingPost.id}`);
      setSuccessMsg('Blog post deleted successfully!');
      setDeleteModalOpen(false);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/admin/all-blogs');
        }
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting blog:', error);
      setErrorMsg('Failed to delete blog post. Please try again.');
      setDeleteModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container size="lg" py="xl">
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={2}>
                  {isEditMode ? 'Edit Blog Post' : 'Create Blog Post'}
                </Title>
                {isEditMode && (
                  <Button
                    color="red"
                    variant="light"
                    onClick={() => setDeleteModalOpen(true)}
                    disabled={loading}
                  >
                    Delete Post
                  </Button>
                )}
              </Group>

              <TextInput
                label="Title"
                placeholder="Enter blog title"
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

              {successMsg && (
                <Alert
                  icon={<IconCheck size={16} />}
                  color="green"
                  withCloseButton
                  onClose={() => setSuccessMsg('')}
                >
                  {successMsg}
                </Alert>
              )}

              {errorMsg && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  withCloseButton
                  onClose={() => setErrorMsg('')}
                >
                  {errorMsg}
                </Alert>
              )}

              <Group justify="space-between">
                <Button
                  variant="subtle"
                  onClick={() => navigate('/admin/all-blogs')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  {isEditMode ? 'Update Post' : 'Create Post'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Blog Post"
        centered
      >
        <Stack gap="md">
          <p>Are you sure you want to delete this blog post? This action cannot be undone.</p>
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => setDeleteModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDelete}
              loading={loading}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}