/**
 * Abstract base class for URL generation in the Clever Cloud API client.
 * Used by SimpleCommand implementations to convert command parameters into API URLs
 * for GET requests. Each API endpoint typically has its own URL generator extending
 * this class.
 *
 * Note: This class is specifically designed for GET requests.
 *
 * @template {string} Api -The API type this command targets (e.g., 'cc-api', 'cc-api-bridge')
 * @template Input - The input parameters type required for URL generation
 * @abstract
 *
 * @example
 * // URL generator for GET application endpoints
 * class AppUrlGenerator extends GetUrl<'apps', AppParams> {
 *   // Generate URL for getting application details
 *   get(params) {
 *     return `/v2/applications/${params.appId}`;
 *   }
 *
 *   // Identify this as an apps API endpoint
 *   get api() {
 *     return 'apps';
 *   }
 * }
 *
 * // Usage in a GET request command
 * class GetAppCommand extends SimpleCommand<'apps', AppParams, App> {
 *   async toRequestParams(params) {
 *     const urlGenerator = new AppUrlGenerator(params);
 *     return {
 *       method: 'GET',  // This class is specifically for GET requests
 *       url: urlGenerator.get(params)
 *     };
 *   }
 * }
 */
export class GetUrl {
  /**
   * Input parameters stored for URL generation
   * @type {Input}
   */
  #params;

  /**
   * Creates a new URL generator instance
   *
   * @param {Input} params - Parameters required for generating the URL
   */
  constructor(params) {
    this.#params = params;
  }

  /**
   * Gets the stored input parameters
   *
   * @returns {Input} The input parameters for URL generation
   */
  get params() {
    return this.#params;
  }

  /**
   * Generates a URL path based on the input parameters.
   * Must be implemented by subclasses.
   *
   * @param {Input} _params - Parameters for URL generation
   * @returns {string} The generated URL path (relative to API base URL)
   * @abstract
   */
  get(_params) {
    throw new Error('Method not implemented');
  }

  /**
   * Gets the API endpoint type this URL generator targets.
   * Must be implemented by subclasses.
   *
   * @returns {Api} The API endpoint type
   * @abstract
   */
  get api() {
    throw new Error('Method not implemented');
  }
}
