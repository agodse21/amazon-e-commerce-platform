import nodemailer from 'nodemailer';
import { buildOrderConfirmationEmail } from '../emails/orderConfirmation.js';
import type { ShippingAddress } from './orderService.js';

const smtpHost = process.env.SMTP_HOST ?? 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT ?? '587', 10);
const smtpUser = process.env.SMTP_USER?.trim();
const smtpPass = process.env.SMTP_PASS?.trim();
const emailFrom = process.env.EMAIL_FROM?.trim() ?? smtpUser;
const emailFromName = process.env.EMAIL_FROM_NAME ?? 'Amazon Store';

const isSmtpConfigured = Boolean(smtpUser && smtpPass && emailFrom);

let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
  }
  return transporter;
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

  if (!isSmtpConfigured) {
    console.log('[EMAIL] SMTP not configured — logging order confirmation');
    console.log({ to: recipient, subject, text });
    return;
  }

  const info = await getTransporter().sendMail({
    from: `${emailFromName} <${emailFrom}>`,
    to: recipient,
    subject,
    html,
    text,
  });

  console.log(`[EMAIL] Order confirmation sent to ${recipient} (messageId: ${info.messageId})`);
};
