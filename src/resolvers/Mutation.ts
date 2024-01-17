import parseSuccessfulPaymentResponse from '../cybersource/utils';
import {
  MutationProcessPaymentArgs,
  ProcessPaymentResult,
  Resolvers,
} from '../__generated__/resolvers-types';
import { configurePaymentAuthorization } from '../cybersource/pay';

export const Mutation: Resolvers = {
  Mutation: {
    async processPayment(
      _: any,
      args: MutationProcessPaymentArgs,
      __: any
    ): Promise<ProcessPaymentResult> {
      try {
        console.log('Payment started: ', args);
        const { instance, requestObj } = configurePaymentAuthorization(args);
        const paymentResponse = await new Promise((resolve, reject) => {
          instance.createPayment(
            requestObj,
            (error: any, data: any, response: any) => {
              if (error) {
                console.error('Error : ', error);
                reject(new Error('Error processing payment: ' + error.message));
              } else if (data) {
                const parsedResponse: ProcessPaymentResult =
                  parseSuccessfulPaymentResponse(error, data, response);
                resolve(parsedResponse);
              } else {
                console.error('No response data');
                reject(new Error('Error processing payment: No response data'));
              }
            }
          );
        });
        console.log({ paymentResponse });
        return paymentResponse;
      } catch (error) {
        return {
          transactionId: 'N/A',
          transactionStatus: 'UNAUTHORIZED',
          message: error.message,
          orderInfo: {
            amountAuthorized: '0',
            totalAmount: '0',
            currency: 'N/A',
          },
          status: 500,
        };
      }
    },
  },
};
