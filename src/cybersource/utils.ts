import { ProcessPaymentResult } from '../__generated__/resolvers-types';

export type PaymentResponse = {
  transactionId: string;
  transactionStatus: string;
  orderInfo: {
    totalAmount: string;
    amountAuthorized: string;
    currency: string;
  };
  status: number;
  message: string;
};
const parseSuccessfulPaymentResponse = (
  error: any,
  data: any,
  response: any
): ProcessPaymentResult => {
  const paymentStatus = response.status;
  const transactionInfo = JSON.parse(response.text);
  const transactionId = transactionInfo.id;
  const transactionStatus = transactionInfo.status;
  const orderInfo = transactionInfo.orderInformation.amountDetails;
  const message = 'Payment processed successfully';

  return {
    transactionId,
    transactionStatus,
    message,
    orderInfo,
    status: paymentStatus,
  };
};

export default parseSuccessfulPaymentResponse;
