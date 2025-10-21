import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/AuthContext';
import { apiService } from '../../config/api';
import {
  Container,
  Paper,
  Title,
  TextInput,
  Button,
  Group,
  Stack,
  Alert,
  Modal,
  Text,
  PasswordInput,
} from '@mantine/core';
import { MdError, MdCheckCircle, MdDelete } from 'react-icons/md';

function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  
  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user data on component mount
  const fetchUserData = async () => {
    try {
      console.log("Fetching user profile data");
      const userData = await apiService.get('/auth/profile');
      
      setName(userData.userName || '');
      setEmail(userData.email || '');
      setPhone(userData.phoneNumber || '');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch profile:", error);
      
      if (error instanceof Error && error.message.includes('401')) {
        navigate('/login');
        return;
      }
      setError('Failed to load profile data');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log("Updating profile");
      await apiService.put('/auth/update-profile', { 
        userName: name, 
        email, 
        phone 
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setLoading(false);
      await fetchUserData();
    } catch (error) {
      setLoading(false);
      console.error("Failed to update profile:", error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      console.log("Changing password");
      await apiService.put('/auth/change-password', { 
        currentPassword, 
        newPassword 
      });

      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to change password:", error);
      setError('Failed to change password. Please check your current password.');
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');

    try {
      console.log("Deleting account");
      await apiService.delete('/auth/delete-account');
      
      setLoading(false);
      logout();
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.error("Failed to delete account:", error);
      setError('Failed to delete account. Please try again.');
      setShowDeleteModal(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xl">My Profile</Title>

      {error && (
        <Alert icon={<MdError size={16} />} color="red" mb="md" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert icon={<MdCheckCircle size={16} />} color="green" mb="md" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Profile Information Section */}
      <Paper shadow="sm" p="xl" mb="xl">
        <Group justify="space-between" mb="md">
          <Title order={2} size="h3">Profile Information</Title>
          {!isEditing && (
            <Button variant="light" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </Group>

        <form onSubmit={handleUpdateProfile}>
          <Stack gap="md">
            <TextInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              required
            />

            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              required
            />

            <TextInput
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
              placeholder="(123) 456-7890"
            />

            {isEditing && (
              <Group justify="flex-end" mt="md">
                <Button
                  variant="default"
                  onClick={() => {
                    setIsEditing(false);
                    fetchUserData();
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </Group>
            )}
          </Stack>
        </form>
      </Paper>

      {/* Change Password Section */}
      <Paper shadow="sm" p="xl" mb="xl">
        <Title order={2} size="h3" mb="md">Change Password</Title>
        
        <form onSubmit={handleChangePassword}>
          <Stack gap="md">
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit" loading={loading}>
                Change Password
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      {/* Delete Account Section */}
      <Paper shadow="sm" p="xl" withBorder style={{ borderColor: '#fa5252' }}>
        <Title order={2} size="h3" mb="md" c="red">Danger Zone</Title>
        <Text size="sm" c="dimmed" mb="md">
          Once you delete your account, there is no going back. Please be certain.
        </Text>
        
        <Button
          color="red"
          leftSection={<MdDelete size={16} />}
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </Button>
      </Paper>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        centered
      >
        <Text mb="md">
          Are you absolutely sure? This action cannot be undone and will permanently delete your account and all associated data.
        </Text>
        
        <Group justify="flex-end">
          <Button
            variant="default"
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteAccount}
            loading={loading}
          >
            Yes, Delete My Account
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default Profile;