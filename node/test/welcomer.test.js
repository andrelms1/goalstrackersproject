const assert = require('assert');
const helper = require('../welcomer/helper');

const endpoint = 'https...';
const keys = {
  p256dh: 'lwvjrkwbvnrkeb',
  auth: 'wvkjkewjbvkw',
};
const subscription = {
  endpoint,
  keys,
};
const event = {
  Records: [
    {
      dynamodb: {
        NewImage: {
          endpoint: {
            S: subscription.endpoint,
          },
          keys: {
            M: {
              auth: {
                S: subscription.keys.auth,
              },
              p256dh: {
                S: subscription.keys.p256dh,
              },
            },
          },
        },
      },
    },
  ],
};

const welcomeMessageObject = {
  title: 'Welcome to Goalstracker!',
  body: 'You are now following your favorite team(s)!',
};

describe('Welcomer service', () => {
  it('should create subscriptions object from DynamoDB stream', () => {
    const result = helper.createSubscriptionsObject(event);
    assert.deepEqual(result, subscription);
  });

  it('should create the correct Welcome message', () => {
    const result = helper.createWelcomeMessageObject();
    assert.deepEqual(result, welcomeMessageObject);
  });
});
