import { useNavigate } from "react-router-dom";
import { apiService } from "../config/api";
import {
  Text,
  Stack,
  Rating,
  TextInput,
  Textarea,
  Button,
  Modal,
  Group,
} from "@mantine/core";
import { useState } from "react";
import { useAuth } from "../components/Auth/AuthContext";
import ReviewToast from "../components/Review/ReviewToast";

interface WriteReviewModalProps {
  productId: number | undefined;
  opened: boolean;
  onClose: () => void;
}

function WriteReviewModal({
  productId,
  opened,
  onClose,
}: WriteReviewModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [formData, setFormData] = useState({
    productId,
    rating: 0,
    title: "",
    comment: "",
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in before submitting a review");
      onClose();
      navigate("/login");
      return;
    }

    try {
      const response = await apiService.post("/Review/create-review", formData);

      setFormData({ productId, rating: 0, title: "", comment: "" });
      onClose();

      setToastType("success");
      setShowToast(true);

      window.location.reload();
    } catch (error) {
      onClose();

      setToastType("error");
      setShowToast(true);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title="Write a Review"
        size="lg"
        centered
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <div>
              <Text size="sm" mb="xs">
                Your Rating
              </Text>
              <Rating
                size="lg"
                value={formData.rating}
                onChange={(value) => handleChange("rating", value)}
              />
            </div>
            <TextInput
              label="Title"
              placeholder="Sum up your experience"
              value={formData.title}
              onChange={(e) => handleChange("title", e.currentTarget.value)}
              required
            />
            <Textarea
              label="Your review"
              placeholder="Share your thoughts about this product"
              minRows={4}
              value={formData.comment}
              onChange={(e) => handleChange("comment", e.currentTarget.value)}
              required
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Submit Review</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      <ReviewToast
        show={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
    </>
  );
}

export default WriteReviewModal;
