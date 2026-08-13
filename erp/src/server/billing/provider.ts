export type CreateCustomerInput = {
  name: string;
  email: string;
  phone?: string | null;
  companyId: string;
  notes?: Record<string, string>;
};

export type CreateCustomerResult = {
  providerCustomerId: string;
};

export type CreateOrderInput = {
  /** Amount in paise (₹ * 100) */
  amountPaise: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
  customerId?: string;
};

export type CreateOrderResult = {
  orderId: string;
  amount: number;
  currency: string;
  keyId?: string | null;
};

export type RefundInput = {
  providerPaymentId: string;
  /** Amount in paise; omit for full refund */
  amountPaise?: number;
};

export type RefundResult = {
  refundId: string;
  amount: number;
};

/**
 * Abstraction over Razorpay (or mock) for checkout + refunds.
 * Subscription lifecycle in LoopC is app-managed; provider subscription cancel is a stub.
 */
export interface PaymentProvider {
  readonly name: string;
  createCustomer(input: CreateCustomerInput): Promise<CreateCustomerResult>;
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
  cancelSubscription(providerSubscriptionId: string): Promise<void>;
  refund(input: RefundInput): Promise<RefundResult>;
}
