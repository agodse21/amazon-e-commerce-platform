import type { ShippingAddress } from '../services/orderService.js';

export interface OrderEmailItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEmailData {
  orderNumber: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  items: OrderEmailItem[];
}

const formatInr = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatAddress = (addr: ShippingAddress): string => {
  const lines = [
    addr.fullName,
    addr.street,
    `${addr.city}, ${addr.state} ${addr.zip}`,
    addr.country,
  ];
  if (addr.phone) lines.push(`Phone: ${addr.phone}`);
  return lines.join('\n');
};

export const buildOrderConfirmationEmail = (order: OrderEmailData) => {
  const { shippingAddress } = order;
  const subject = `Order confirmed — ${order.orderNumber}`;

  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">${item.productName}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${formatInr(item.unitPrice * item.quantity)}</td>
        </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="color:#067d62;font-size:22px;margin:0 0 8px;">Thank you for your order!</h1>
  <p style="margin:0 0 16px;">Hi ${shippingAddress.fullName}, your order has been placed successfully.</p>
  <p style="margin:0 0 24px;"><strong>Order number:</strong> ${order.orderNumber}</p>

  <h2 style="font-size:16px;margin:0 0 8px;">Items ordered</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="border-bottom:2px solid #d1d5db;">
        <th style="text-align:left;padding:8px 0;">Item</th>
        <th style="text-align:center;padding:8px 0;">Qty</th>
        <th style="text-align:right;padding:8px 0;">Price</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <table style="width:100%;margin-bottom:24px;">
    <tr><td>Subtotal</td><td style="text-align:right;">${formatInr(order.subtotal)}</td></tr>
    <tr><td>Tax</td><td style="text-align:right;">${formatInr(order.tax)}</td></tr>
    <tr><td>Shipping</td><td style="text-align:right;">${order.shippingCost === 0 ? 'FREE' : formatInr(order.shippingCost)}</td></tr>
    <tr><td style="padding-top:8px;font-weight:bold;">Order total</td><td style="padding-top:8px;text-align:right;font-weight:bold;">${formatInr(order.total)}</td></tr>
  </table>

  <h2 style="font-size:16px;margin:0 0 8px;">Delivery address</h2>
  <p style="margin:0 0 24px;white-space:pre-line;">${formatAddress(shippingAddress)}</p>

  <p style="color:#6b7280;font-size:13px;margin:0;">You can track your order from your account orders page.</p>
</body>
</html>`;

  const text = [
    `Thank you for your order, ${shippingAddress.fullName}!`,
    `Order number: ${order.orderNumber}`,
    '',
    'Items:',
    ...order.items.map(
      (item) =>
        `- ${item.productName} x${item.quantity} — ${formatInr(item.unitPrice * item.quantity)}`
    ),
    '',
    `Subtotal: ${formatInr(order.subtotal)}`,
    `Tax: ${formatInr(order.tax)}`,
    `Shipping: ${order.shippingCost === 0 ? 'FREE' : formatInr(order.shippingCost)}`,
    `Total: ${formatInr(order.total)}`,
    '',
    'Delivery address:',
    formatAddress(shippingAddress),
  ].join('\n');

  return { subject, html, text };
};
