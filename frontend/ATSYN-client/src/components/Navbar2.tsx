import { Paper, Group, Button  } from '@mantine/core';

function NavBar2(){
    return(
    <Paper shadow="lg" p="xl">
        <Group>
            <Button variant="light" color="rgba(0, 0, 0, 1)" size="md">Home</Button>
            <Button variant="light" color="rgba(0, 0, 0, 1)" size="md">About</Button>
            <Button variant="light" color="rgba(0, 0, 0, 1)" size="md">Products</Button>
            <Button variant="light" color="rgba(0, 0, 0, 1)" size="md">Contact</Button>
            <Button variant="light" color="rgba(0, 0, 0, 1)" size="md">Login/Sign Up</Button>
        </Group>
    </Paper>
    );
}

export default NavBar2