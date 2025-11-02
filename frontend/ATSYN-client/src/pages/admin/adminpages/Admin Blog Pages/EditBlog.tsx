import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Loader, Center } from '@mantine/core';
import { apiService } from '../../../../config/api';
import { NewsForm } from '../../admincomponents/NewsForm';

interface NewsPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const data: NewsPost = await apiService.get(`/news/${id}`);
      setPost(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch post:', error);
      setLoading(false);
      alert('Failed to load blog post');
      navigate('/admin/all-blogs');
    }
  };

  if (loading) {
    return (
      <Center style={{ height: '400px' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!post) {
    return <Container>Blog post not found</Container>;
  }

  return (
    <NewsForm
      editingPost={post}
      onSuccess={() => {
        navigate('/admin/all-blogs');
      }}
    />
  );
}

export default EditBlog;