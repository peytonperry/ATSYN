import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button, Text, Stack, Alert, Box, Loader, Center } from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { apiService } from "../../config/api";

interface PaymentFormProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
        console.log("Stripe is ready")
      setIsReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.post("/payments/create-intent", { 
        amount 
      });

      const { clientSecret } = response;

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        onError?.(stripeError.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        setSuccess(true);
        onSuccess?.();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loader while Stripe is initializing
  if (!isReady) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Loader color="purple" size="lg" />
          <Text c="dimmed">Loading payment form...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text size="lg" fw={500}>
          Payment Amount: ${(amount / 100).toFixed(2)}
        </Text>

        {/* Stripe Card Element */}
        <Box
          p="md"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            minHeight: "44px",
          }}
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#2d2d2d",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  "::placeholder": {
                    color: "#868e96",
                  },
                  iconColor: "#495057",
                },
                invalid: {
                  color: "#fa5252",
                  iconColor: "#fa5252",
                },
              },
            }}
          />
        </Box>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            {error}
          </Alert>
        )}

        {success && (
          <Alert icon={<IconCheck size={16} />} color="green">
            Payment successful!
          </Alert>
        )}

        <Button
          type="submit"
          loading={loading}
          disabled={!stripe || success}
          fullWidth
          size="lg"
        >
          {success ? "Payment Complete" : `Pay $${(amount / 100).toFixed(2)}`}
        </Button>
      </Stack>
    </form>
  );
}