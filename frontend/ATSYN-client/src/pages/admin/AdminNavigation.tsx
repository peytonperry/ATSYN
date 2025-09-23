import "./AdminNavigation.css"
import { useState } from "react";
import {
  AppShell,
  Group,
  Text,
  UnstyledButton,
  ThemeIcon,
} from "@mantine/core";
import {
  IconLayoutDashboard,
  IconUsers,
  IconSettings,
} from "@tabler/icons-react";
import { useParams } from "react-router-dom";


function AdminNavigation() {
    //     console.log("Rendering AdminNavigation...");
    //   const [opened, { toggle }] = useDisclosure();
    
    const [activeLink, setActiveLink] = useState("Dashboard");
    
    const links = [
        { label: "Dashboard", icon: IconLayoutDashboard },
        { label: "Customers", icon: IconUsers },
        { label: "Settings", icon: IconSettings },
    ];

  //getButtonStyle(activeLink === label)

  return (

       <AppShell
          header={{ height: 60 }}
          navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: false } }}
          >
              <AppShell.Header>
                  <Group p="md">
                      <Text fw={700} fz="lg">
                          Header
                      </Text>
                  </Group>
              </AppShell.Header>
      
              <AppShell.Navbar p="xs">
               <AppShell.Section>
                 <Group p="md">
                   <Text fw={700} fz="lg">
                      Admin Panel
                    </Text>
                  </Group>
               </AppShell.Section>
      
                <AppShell.Section grow>
                 {links.map(({ label, icon: Icon }) => (
                  <UnstyledButton
                     key={label}
                     onClick={() => setActiveLink(label)}
                     className="getButtonStyle"
                     aria-label={`Navigate to ${label}`}
                  >
                     <ThemeIcon variant="light" size="lg">
                        <Icon size={20} />
                     </ThemeIcon>
                     <Text>{label}</Text>
                 </UnstyledButton>
                 ))}
              </AppShell.Section>
             </AppShell.Navbar>
      
           <AppShell.Main>
             <Text fz="xl" fw={600}>
                {activeLink}
             </Text>
           </AppShell.Main>
      </AppShell>
  )

}

export default AdminNavigation;
