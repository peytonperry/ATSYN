import {
  Container,
  Text,
  Paper,
  Stack,
  Title,
  Badge,
  Group,
} from "@mantine/core";

interface NewsDto {
  id: number;
  title: string;
  content: string;
  createdAt: string; 
}

interface CreateNewsDto {
  title: string;
  content: string;
}

function BlogCreate(){
    return(
        <Container>
            <Paper>
                
            </Paper>
        </Container>
    );
}

export default BlogCreate;
