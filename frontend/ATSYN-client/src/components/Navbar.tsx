import { Container, Group, Button  } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function NavBar(){
    const navigate = useNavigate();
    
    //const BUTTON_COLOR = "#80428b"
    //const BUTTON_COLOR = "#016b55"
    const BUTTON_COLOR = "#8A00C4"


    return(
    <Container fluid h={75} bg='dark.9' p="md"> 
        <Group justify='center'>
            <Button variant="filled" color={BUTTON_COLOR} size="md"
            onClick={() => navigate('/')}
            >
                Home
            </Button>
            <Button variant="filled" color={BUTTON_COLOR} size="md"
            onClick={() => navigate('/about')}
            >
                About
            </Button>
            <Button variant="filled" color={BUTTON_COLOR} size="md"
            onClick={() => navigate('/products')}
            >
                Products
            </Button>
            <Button variant="filled" color={BUTTON_COLOR} size="md"
            onClick={() => navigate('/contact')}
            >
                Contact
            </Button>
            <Button variant="filled" color={BUTTON_COLOR} size="md"
            onClick={() => navigate('/login')}
            >
                Login/Sign Up
            </Button>
        </Group>
    </Container>
    );
}

export default NavBar