import {fetch} from '@alwatr/fetch';

describe('fetch with search params', () => {
  it('should make a GET request to the specified URL', async () => {
    /**
     * @type {import('@alwatr/fetch').FetchOptions}
     */
    const options = {
      url: 'http://httpbin.org/get',
      queryParameters: {
        a: 2,
      },
      cacheStrategy: 'network_only',
      removeDuplicate: 'auto',
    };

    fetch(options);
    const response = await fetch(options);
    const responseJson = await response.json();

    expect(response.status).toBe(200);
    expect(responseJson.args.a).toBe('2');
  });
});
