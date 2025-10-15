import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../../config/api";
import {
  Container,
  Text,
  Paper,
  Stack,
  Title,
  Badge,
  Button,
  Group,
} from "@mantine/core";

interface NewsPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      const data: NewsPost = await apiService.get(`/News/${id}`);
      console.log(data);
      setNews(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (!news) {
    return <Container>Blog post not found</Container>;
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Button 
          variant="subtle" 
          onClick={() => navigate("/blog")}
          style={{ alignSelf: "flex-start" }}
        >
          ← Back to Blogs
        </Button>

        <Paper shadow="sm" p="xl" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Title order={1}>{news.title}</Title>
              <Badge color="blue" variant="light" size="lg">
                {new Date(news.createdAt).toLocaleDateString()}
              </Badge>
            </Group>
            
            <Text style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {news.content}
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default NewsDetail;