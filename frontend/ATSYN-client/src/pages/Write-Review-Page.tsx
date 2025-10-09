import { useParams } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthContext";
import { apiService } from "../config/api";
import {
  Paper,
  Text,
  Title,
  Stack,
  Rating,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";

function WriteReview() {
  const { productId } = useParams();

  return (
    <Paper withBorder p="md">
      <Title order={3} mb="md">
        Write a Review
      </Title>
      <Stack gap="md">
        <div>
          <Text size="sm" mb="xs">
            Your Rating
          </Text>
          <Rating size="lg" />
        </div>

        <TextInput label="Title" placeholder="Sum up your experience" />
        <Textarea
          label="Your review"
          placeholder="Share your thoughts about this product"
          minRows={4}
        />
        <Button>Submit Review</Button>
      </Stack>
    </Paper>
  );
}

export default WriteReview;
