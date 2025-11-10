import {
  Container,
  Text,
  Paper,
  List,
  Stack,
  TextInput,
  Grid,
  GridCol,
  Button,
  Textarea,
} from "@mantine/core";

function ContactPage() {
  const SPACING = "lg";

  return (
    <Container size="xl" py="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper shadow="xl" radius="md" withBorder p="xl">
            <Text fw={700} size="xl" ta="center" mb="lg">
              Return Policy
            </Text>
            <Text mb={SPACING}>
              Thank you for shopping at All The Shit You Need. We strive to
              provide high-quality tattoo supplies to our customers. If you are
              not entirely satisfied with your purchase, we're here to help.
            </Text>
            <Text fw={700} mb={SPACING}>
              30-Day Return Window:
            </Text>
            <Text mb={SPACING}>
              You have 30 calendar days from the date of purchase to return an
              item for a refund or exchange. To be eligible for a return, your
              item must be unused and in the same condition that you received
              it. It must also be in the original packaging.
            </Text>
            <Text fw={700} mb={SPACING}>
              Items Eligible for Return:
            </Text>
            <Text mb={SPACING}>
              Our return policy applies to items that are surgical or sanitary
              in nature, provided they meet the criteria mentioned above. This
              includes but is not limited to:
              <List>
                <List.Item>
                  <Text inherit>
                    <Text component="span" fw={700}>
                      Unopened
                    </Text>{" "}
                    bottles of ink
                  </Text>
                </List.Item>
                <List.Item>
                  <Text inherit>
                    <Text component="span" fw={700}>
                      Unopened
                    </Text>{" "}
                    packages of needles
                  </Text>
                </List.Item>
                <List.Item>
                  Other standard tattoo equipment (e.g., grips, tubes) that can
                  be resealed and maintain hygienic integrity
                </List.Item>
                <List.Item>
                  Hygiene barriers (e.g., barrier film, tattoo towels) in their
                  original packaging
                </List.Item>
              </List>
            </Text>
            <Text fw={700} mb={SPACING}>
              Items Not Eligible for Return:
            </Text>
            <Text mb={SPACING}>
              We cannot accept returns for the following items, as they cannot
              be compromised hygienically:
              <List>
                <List.Item>
                  <Text inherit>
                    <Text component="span" fw={700}>
                      Opened
                    </Text>{" "}
                    bottles of ink
                  </Text>
                </List.Item>
                <List.Item>
                  <Text inherit>
                    <Text component="span" fw={700}>
                      Used
                    </Text>{" "}
                    needles
                  </Text>
                </List.Item>
                <List.Item>Tattoo machines</List.Item>
                <List.Item>
                  Barrier products that have been opened or used
                </List.Item>
                <List.Item>
                  Any other items that have been compromised in terms of hygiene
                </List.Item>
              </List>
            </Text>
            <Text fw={700} mb={SPACING}>
              Return Process:
            </Text>
            <Text mb={SPACING}>
              To initiate a return, please contact us at
              customersales@alltheshityouneed.com to receive further
              instructions. We may require proof of purchase, such as a receipt
              or order confirmation email.
            </Text>
            <Text fw={700} mb={SPACING}>
              Refunds:
            </Text>
            <Text mb={SPACING}>
              Once your return is received and inspected, we will notify you of
              the approval or rejection of your refund. If approved, your refund
              will be processed and a credit will be applied to your original
              method of payment within a certain number of days, depending on
              your payment provider's policies. There will be a restocking fee
              on all returns of 15% of the item’s value.
            </Text>
            <Text fw={700} mb={SPACING}>
              Exchanges:
            </Text>
            <Text mb={SPACING}>
              If you wish to exchange an item, please contact us to arrange the
              exchange process. Exchanges are subject to product availability.
              If an item is damaged, please take photos of the item upon receipt
              and send them to us for verification.
            </Text>
            <Text fw={700} mb={SPACING}>
              Shipping:
            </Text>
            <Text mb={SPACING}>
              You will be responsible for paying for your own shipping costs for
              returning your item. Shipping costs are non-refundable. If you
              receive a refund, the cost of return shipping will be deducted
              from your refund.
            </Text>
            <Text fw={700} mb={SPACING}>
              Contact Us:
            </Text>
            <Text mb={SPACING}>
              If you have any questions about our return policy, please contact
              us at customersales@alltheshityouneed.com.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="xl" radius="md" withBorder p="xl">
            <Text fw={700} size="xl" ta="center" mb="lg">
              Contact Us
            </Text>
            {/*Needs to be wrapped in a form */}
            <Stack gap="md">
              <TextInput label="Name" placeholder="Your name" required />
              <TextInput
                label="Email"
                placeholder="your@email.com"
                type="email"
                required
              />
              <TextInput
                label="Subject"
                placeholder="What's this about?"
                required
              />
              <Textarea
                label="Message"
                placeholder="Your message..."
                minRows={4}
                required
              />
              <Button fullWidth>Send Message</Button>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
export default ContactPage;
