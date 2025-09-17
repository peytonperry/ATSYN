import { Container, Group, Button  } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function NavBar(){
    const navigate = useNavigate();

    return(
    <Container fluid h={50} bg='dark.9' py="3.5px">
        <Group justify="center">
            <Button variant="filled" color="#0F52BA" size="md"
            onClick={() => navigate('/')}
            >
                Home
            </Button>
            <Button variant="filled" color="#0F52BA" size="md"
            onClick={() => navigate('/about')}
            >
                About
            </Button>
            <Button variant="filled" color="#0F52BA" size="md"
            onClick={() => navigate('/products')}
            >
                Products
            </Button>
            <Button variant="filled" color="#0F52BA" size="md"
            onClick={() => navigate('/contact')}
            >
                Contact
            </Button>
            <Button variant="filled" color="#0F52BA" size="md"
            onClick={() => navigate('/login')}
            >
                Login/Sign Up
            </Button>
        </Group>
    </Container>
    );
}

export default NavBar