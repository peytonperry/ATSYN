//import { useState } from "react";
import "./admin-navigation.css"
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger } from "@mantine/core";
// import {
//   AppShell,
//   Group,
//   Text,
//   UnstyledButton,
//   ThemeIcon,
//   Burger,
// } from "@mantine/core";
// import {
//   IconLayoutDashboard,
//   IconUsers,
//   IconSettings,
//   IconShoppingCart,
// } from "@tabler/icons-react";

//   const [activeLink, setActiveLink] = useState("Dashboard");

//   const links = [
//     { label: "Dashboard", icon: IconLayoutDashboard },
//     { label: "Users", icon: IconUsers },
//     { label: "Orders", icon: IconShoppingCart },
//     { label: "Settings", icon: IconSettings },
//   ];

export default function AdminNavigation() {

  const [opened, { toggle }] = useDisclosure();
  //getButtonStyle(activeLink === label)

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        Navbar
      </AppShell.Navbar>

      <AppShell.Main p="md">
        Main
      </AppShell.Main>
    </AppShell>

  );
}



//  <AppShell
//     header={{ height: 60 }}
//     navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: false } }}
//     >
//         <AppShell.Header>
//             <Group p="md">
//                 <Text fw={700} fz="lg">
//                     Header
//                 </Text>
//             </Group>
//         </AppShell.Header>

//         <AppShell.Navbar p="xs">
//          <AppShell.Section>
//            <Group p="md">
//              <Text fw={700} fz="lg">
//                 Admin Panel
//               </Text>
//             </Group>
//          </AppShell.Section>

//           <AppShell.Section grow>
//            {links.map(({ label, icon: Icon }) => (
//             <UnstyledButton
//                key={label}
//                onClick={() => setActiveLink(label)}
//                className="getButtonStyle"
//                aria-label={`Navigate to ${label}`}
//             >
//                <ThemeIcon variant="light" size="lg">
//                   <Icon size={20} />
//                </ThemeIcon>
//                <Text>{label}</Text>
//            </UnstyledButton>
//            ))}
//         </AppShell.Section>
//        </AppShell.Navbar>

//      <AppShell.Main>
//        <Text fz="xl" fw={600}>
//           {activeLink}
//        </Text>
//      </AppShell.Main>
// </AppShell>