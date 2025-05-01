<p align="center">
    <img title="NotchPay" height="200" src="https://notch.sfo3.cdn.digitaloceanspaces.com/logo/svg/logo-full.svg" width="70%"/>
</p>


# Notchpay API Client


![NPM Version](https://img.shields.io/npm/v/notchpay-client)
![NPM Downloads](https://img.shields.io/npm/d18m/notchpay-client)
![NPM License](https://img.shields.io/npm/l/notchpay-client)

## Introduction

This JavaScript library simplifies the integration with NotchPay API in your JavaScript applications. It handles the complexity of direct API integration, enabling quick and efficient API calls.

Available functionalities include:

- Payments (Mobile Money, Direct Charges)
- Recipients
- Account Management

## Table of Content
1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Initialization](#initialization)
4. [Usage](#usage)
   - [Payment Operations](#payment-operations)
   - [Recipient Operations](#recipient-operations)
5. [Support](#support)
6. [Debugging Errors](#debugging-errors)
7. [License](#license)
8. [Changelog](/CHANGELOG.md)

## 1. Requirements

1. Node 12 or higher
2. NotchPay [API Keys](https://business.notchpay.co/developer/api-keys)

## 2. Installation

To install the package, run the following command:

```sh
# Using npm
npm install notchpay-client@latest

# Using yarn
yarn add notchpay-client

# Using pnpm
pnpm add notchpay-client
```

## 3. Initialization

```typescript
import { NotchpayClient } from 'notchpay-client';

const notchpay = new NotchpayClient({
    publicKey: 'YOUR_PUBLIC_KEY',
    privateKey: 'YOUR_PRIVATE_KEY', // optional
    hashKey: 'YOUR_HASH_KEY', // optional
    debug: true // Set to false in production
});
```

For testing, use the Sandbox Public Keys. For production, use Live Public Keys.
You can obtain your API keys from the NotchPay dashboard: https://business.notchpay.co/developer/api-keys.

## 4. Usage

### Payment Operations

#### Create Payment (Modern Method)

```javascript
const paymentData = {
  amount: 5000,
  currency: "XAF",
  description: "Payment for product/service",
  customer: {
    email: "customer@example.com",
    name: "Customer Name",
    phone: "+237600000000" // optional
  }
};

const response = await notchpay.payments.create(paymentData);

console.log(response.transaction.reference); // Save this reference for future operations
console.log(response.authorization_url); // Redirect user to this URL to complete payment
```

#### Initialize Payment (Legacy Method)

```javascript
const legacyPaymentData = {
  amount: 5000,
  currency: "XAF",
  description: "Payment for product/service",
  email: "customer@example.com",
  callback: "https://your-website.com/callback" // URL to redirect after payment
};

const response = await notchpay.payments.initialize(legacyPaymentData);

console.log(response.transaction.reference); // Save this reference for future operations
console.log(response.authorization_url); // Redirect user to this URL to complete payment
```

#### Get Payment Details

```javascript
const paymentDetails = await notchpay.payments.get(transactionReference);

console.log(paymentDetails.transaction.status); // Check payment status
```

#### List All Payments

```javascript
const payments = await notchpay.payments.getAll();

console.log(payments.items); // Array of payment transactions
console.log(payments.totals); // Total number of payments
```

#### Direct Charge (Mobile Money)

```javascript
// First create a payment
const paymentData = {
  amount: 5000,
  currency: "XAF",
  description: "Mobile money payment",
  customer: {
    email: "customer@example.com",
    name: "Customer Name"
  }
};
const response = await notchpay.payments.create(paymentData);

// Then charge directly with mobile money
const chargeData = {
  channel: NotchPayChannel.MOBILE, // or NotchPayChannel.MTN, NotchPayChannel.ORANGE
  data: {
    phone: "+237600000000" // Customer's mobile money number
  }
};
const chargeResponse = await notchpay.payments.directCharge(
  response.transaction.reference,
  chargeData
);

console.log(chargeResponse.code); // 202 indicates successful processing
```

#### Initialize Mobile Money Payment (Convenience Method)

You can also initiate a mobile money payment in one step:

```javascript
const response = await notchpay.payments.initializeMobileMoneyPayment(
  paymentData,
  "+237600000000", // Phone number for mobile money
  NotchPayChannel.MOBILE // or specific provider: NotchPayChannel.MTN, NotchPayChannel.ORANGE
);

console.log(response.code); // 202 indicates successful processing
```

### Recipient Operations

#### Create a Recipient

```javascript
const recipientData = {
  email: "recipient@example.com",
  name: "Recipient Name",
  channel: NotchPayChannel.MOBILE,
  country: "CM",
  number: "+237600000000",
  description: "Vendor payment recipient"
};

const response = await notchpay.recipients.create(recipientData);
```

#### List All Recipients

```javascript
const recipients = await notchpay.recipients.getAll();

console.log(recipients.items); // Array of recipients
```

## 5. Support

For additional help with using this library, contact the technical team via [email](mailto:hello@notchpay.co) or on [Telegram](https://t.me/notchpay). You can also follow us on [Twitter](https://twitter.com/thenotchpay) and provide feedback.

## 6. Debugging Errors

When integrating, you may encounter various errors:
- For `401 Unauthorized` errors, check your API keys
- For `422 Validation` errors, check the request parameters
- For server errors, contact our [support team](mailto:hello@notchpay.co)

Enable debug mode during development to see detailed error information:

```typescript
const notchpay = new NotchpayClient({
    // ...other options
    debug: true
});
```

## 7. License

By contributing to this library, you agree that your contributions may be placed under the MIT license.
Copyright (c) [Notchpay Sarl](https://notchpay.co).

## 8. Changelog

See [CHANGELOG.md](/CHANGELOG.md) for details of changes in each release.

Made with 😍 by [Daniel Leussa](https://github.com/danofred00)