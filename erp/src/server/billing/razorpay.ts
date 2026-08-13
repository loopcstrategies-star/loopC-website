import crypto from "crypto";
import { nanoid } from "nanoid";
import type {
  CreateCustomerInput,
  CreateCustomerResult,
  CreateOrderInput,
  CreateOrderResult,
  PaymentProvider,
  RefundInput,
  RefundResult,
} from "@/server/billing/provider";

class MockProvider implements PaymentProvider {
  readonly name = "mock";

  async createCustomer(input: CreateCustomerInput): Promise<CreateCustomerResult> {
    return { providerCustomerId: `cust_mock_${input.companyId.slice(0, 8)}_${nanoid(8)}` };
  }

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    return {
      orderId: `order_mock_${nanoid(14)}`,
      amount: input.amountPaise,
      currency: input.currency ?? "INR",
      keyId: "mock_key",
    };
  }

  verifyWebhookSignature(_payload: string, _signature: string): boolean {
    // Accept all signatures in mock mode (dev only)
    return true;
  }

  verifyPaymentSignature(_input: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    return true;
  }

  async cancelSubscription(_providerSubscriptionId: string): Promise<void> {
    return;
  }

  async refund(input: RefundInput): Promise<RefundResult> {
    return {
      refundId: `rfnd_mock_${nanoid(10)}`,
      amount: input.amountPaise ?? 0,
    };
  }
}

class RazorpayProvider implements PaymentProvider {
  readonly name = "razorpay";
  private keyId: string;
  private keySecret: string;
  private webhookSecret: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any;

  constructor(keyId: string, keySecret: string, webhookSecret: string) {
    this.keyId = keyId;
    this.keySecret = keySecret;
    this.webhookSecret = webhookSecret;
  }

  private async getClient() {
    if (!this.client) {
      const Razorpay = (await import("razorpay")).default;
      this.client = new Razorpay({
        key_id: this.keyId,
        key_secret: this.keySecret,
      });
    }
    return this.client;
  }

  async createCustomer(input: CreateCustomerInput): Promise<CreateCustomerResult> {
    const client = await this.getClient();
    const customer = await client.customers.create({
      name: input.name,
      email: input.email,
      contact: input.phone ?? undefined,
      notes: {
        companyId: input.companyId,
        ...input.notes,
      },
    });
    return { providerCustomerId: customer.id as string };
  }

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const client = await this.getClient();
    const order = await client.orders.create({
      amount: input.amountPaise,
      currency: input.currency ?? "INR",
      receipt: input.receipt.slice(0, 40),
      notes: input.notes,
      ...(input.customerId ? { customer_id: input.customerId } : {}),
    });
    return {
      orderId: order.id as string,
      amount: Number(order.amount),
      currency: String(order.currency ?? "INR"),
      keyId: this.keyId,
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!signature) return false;
    const secret = this.webhookSecret || this.keySecret;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }

  verifyPaymentSignature(input: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    if (!input.signature || !input.orderId || !input.paymentId) return false;
    const body = `${input.orderId}|${input.paymentId}`;
    const expected = crypto
      .createHmac("sha256", this.keySecret)
      .update(body)
      .digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(input.signature);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }

  async cancelSubscription(_providerSubscriptionId: string): Promise<void> {
    // LoopC manages subscription state locally; Razorpay recurring is not wired yet.
    return;
  }

  async refund(input: RefundInput): Promise<RefundResult> {
    const client = await this.getClient();
    const payload: { amount?: number } = {};
    if (input.amountPaise != null) payload.amount = input.amountPaise;
    const refund = await client.payments.refund(input.providerPaymentId, payload);
    return {
      refundId: refund.id as string,
      amount: Number(refund.amount ?? input.amountPaise ?? 0),
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim() ?? "";

  if (!keyId || !keySecret) {
    return new MockProvider();
  }

  return new RazorpayProvider(keyId, keySecret, webhookSecret);
}

export { MockProvider, RazorpayProvider };
