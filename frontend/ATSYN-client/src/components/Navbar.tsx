import { Container, Group, Button  } from '@mantine/core';

function NavBar(){
    return(
    <Container fluid h={50}>
        <Group>
            <Button variant="light" color="rgba(0, 0, 0, 1)" size="md">Home</Button>
            <Button variant="light" color="rgba(0, 0, 0, 1)" size="md">About</Button>
            <Button variant="light" color="rgba(0, 0, 0, 1)" size="md">Products</Button>
            <Button variant="light" color="rgba(0, 0, 0, 1)" size="md">Contact</Button>
            <Button variant="light" color="rgba(0, 0, 0, 1)" size="md">Login/Sign Up</Button>
        </Group>
    </Container>
    );
}

export default NavBar