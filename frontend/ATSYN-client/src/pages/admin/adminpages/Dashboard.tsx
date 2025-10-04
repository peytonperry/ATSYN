import { Card, Image, Text } from "@mantine/core";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
      <Card
        className="dashboard-card"
        onClick={() => navigate("/admin/productmanagement")}
        style = {{ cursor: "pointer" }}
      >
        <Card.Section>
          <Image
            src="https://media.istockphoto.com/id/1287967737/photo/one-artist-tattooing-a-mans-back-in-studio.jpg?s=1024x1024&w=is&k=20&c=DQ-t8U1G3mjzo6VwNriGphTr6u2YyPuZrepHYQLbVhU="
            h={160}
            alt="Tattoo Artist at Work"
          />
        </Card.Section>

        <Text fw={500} size="lg" mt="md">
          Product Management
        </Text>

        <Text mt="xs" c="dimmed" size="sm">
          Manage your products, add new items, and update existing ones.
        </Text>
      </Card>
    </div>
  );
};

export default Dashboard;

