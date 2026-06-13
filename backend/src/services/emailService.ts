import nodemailer from 'nodemailer';
import { buildOrderConfirmationEmail } from '../emails/orderConfirmation.js';
import type { ShippingAddress } from './orderService.js';

const getSmtpConfig = () => {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.EMAIL_FROM?.trim() ?? user;

  return {
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    user,
    pass,
    from,
    fromName: process.env.EMAIL_FROM_NAME ?? 'Amazon Store',
    isConfigured: Boolean(user && pass && from),
  };
};

export interface OrderForEmail {
  orderNumber: string;
  subtotal: number | { toString(): string };
  tax: number | { toString(): string };
  shippingCost: number | { toString(): string };
  total: number | { toString(): string };
  shippingAddress: unknown;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number | { toString(): string };
  }>;
}

const toNumber = (value: number | { toString(): string }): number => Number(value);

export const sendOrderConfirmationEmail = async (order: OrderForEmail): Promise<void> => {
  const shippingAddress = order.shippingAddress as ShippingAddress;
  const recipient = shippingAddress.email;

  if (!recipient) {
    console.warn('[EMAIL] No email on shipping address; skipping confirmation');
    return;
  }

  const emailData = {
    orderNumber: order.orderNumber,
    subtotal: toNumber(order.subtotal),
    tax: toNumber(order.tax),
    shippingCost: toNumber(order.shippingCost),
    total: toNumber(order.total),
    shippingAddress,
    items: order.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: toNumber(item.unitPrice),
    })),
  };

  const { subject, html, text } = buildOrderConfirmationEmail(emailData);
  const smtp = getSmtpConfig();

  if (!smtp.isConfigured) {
    console.log('[EMAIL] SMTP not configured — logging order confirmation');
    console.log({ to: recipient, subject, text });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  const info = await transporter.sendMail({
    from: `${smtp.fromName} <${smtp.from}>`,
    to: recipient,
    subject,
    html,
    text,
  });

  console.log(`[EMAIL] Order confirmation sent to ${recipient} (messageId: ${info.messageId})`);
};
