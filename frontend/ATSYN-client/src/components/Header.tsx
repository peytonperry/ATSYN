import {
  Anchor,
  Burger,
  Button,
  Container,
  Flex,
  Group,
  Text
} from '@mantine/core';
import type { ContainerProps, MantineBreakpoint, MantineRadius } from '@mantine/core';
import classes from './Header.module.css';

export type HeaderLink = {
  label: string;
  href: string;
};

const HEADER_LINKS: HeaderLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

type HeaderProps = ContainerProps & {
  logo?: React.ReactNode;
  links?: HeaderLink[];
  callToActionTitle?: string;
  callToActionUrl?: string;
  callToActionIcon?: React.ReactNode;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
  breakpoint?: MantineBreakpoint;
  radius?: MantineRadius | number;
};

export const Header = ({
  style,
  breakpoint = 'xs',
  logo = (
    <Text fw="bold" fz={24} mx="xs">
      ATSYN
    </Text>
  ),
  callToActionTitle = 'Get Started',
  callToActionUrl = '#',
  callToActionIcon,
  links = HEADER_LINKS,
  onMenuToggle,
  isMenuOpen,
  h = 60,
  radius = 30,
  ...containerProps
}: HeaderProps) => (
  <Container
    className={classes.container}
    component="header"
    style={{ borderRadius: radius, ...style }}
    w={{ base: '100%', [breakpoint]: 'fit-content' }}
    //h={h}
    {...containerProps}
  >
    <Flex justify="space-between" align="center" h="100%" gap="xs" wrap="nowrap">
      <Group gap={0} style={{ flexShrink: 0 }}>
        <Burger size="sm" opened={isMenuOpen} onClick={onMenuToggle} hiddenFrom={breakpoint} />
        {logo}
      </Group>

      <Flex
        flex={1}
        justify="center"
        px="xl"
        h="100%"
        align="center"
        wrap="nowrap"
        visibleFrom={breakpoint}
        gap="xl"
        className={classes.linkContainer}
      >
        {links.map((link) => (
          <Anchor key={link.href} className={classes.link} href={link.href} td="none">
            {link.label}
          </Anchor>
        ))}
      </Flex>

      <Button
        href={callToActionUrl}
        className={classes.cta}
        radius="xl"
        style={{ flexShrink: 0 }}
        component="a"
        rightSection={callToActionIcon}
      >
        {callToActionTitle}
      </Button>
    </Flex>
  </Container>
);
