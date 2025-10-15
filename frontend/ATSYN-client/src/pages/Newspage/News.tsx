import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../config/api";
import {
  Container,
  Text,
  Paper,
  Stack,
  Title,
  Badge,
  Group,
} from "@mantine/core";

interface NewsPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

function News() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data: NewsPost[] = await apiService.get("/news");
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

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1}>News & Updates</Title>
        
        <Stack gap="md">
          {news.map((newsPost) => (
            <Paper
              key={newsPost.id}
              shadow="sm"
              p="lg"
              withBorder
              style={{ 
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onClick={() => navigate(`/blog/${newsPost.id}`)}
            >
              <Stack gap="xs">
                <Group justify="space-between" align="flex-start">
                  <Title order={3}>{newsPost.title}</Title>
                  <Badge color="blue" variant="light">
                    {new Date(newsPost.createdAt).toLocaleDateString()}
                  </Badge>
                </Group>
                <Text lineClamp={3} c="dimmed">
                  {newsPost.content}
                </Text>
                <Text size="sm" c="blue" style={{ alignSelf: "flex-end" }}>
                  Read more →
                </Text>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}

export default News;