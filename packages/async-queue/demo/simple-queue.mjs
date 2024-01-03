import {AsyncQueue} from '@alwatr/async-queue';
import {waitForTimeout} from '@alwatr/wait';

const queue = new AsyncQueue();

async function longTask(n) {
  console.log('longTask(%s)', n);
  await queue.push('longTaskId', async () => {
    console.log('longTask %s start', n);
    // Simulate a long task
    await waitForTimeout(2_000);
  });
  console.log('longTask %s end', n);
}

// run the tasks parallel
longTask(1);
longTask(2);
longTask(3).then(() => console.log('longTask 3 resolved'));
longTask(4)

