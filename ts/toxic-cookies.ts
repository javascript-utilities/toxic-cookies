'use strict';


/**
 * Enables static methods to be called from within class methods
 * @see {link} - https://github.com/Microsoft/TypeScript/issues/3841
 */
interface Toxic_Cookies {
  constructor: typeof Toxic_Cookies;
}


/**
 * Value parsed from `document.cookie` that may be type coerced
 * @typedef {(null|number|string|undefined)} coercedValue
 */
type coercedValue = null | number | string | undefined;


/**
 * Object of key value pares built from parsing `document.cookie`
 * @typedef {Object} coercedCookies
 */
interface coercedCookies {
  [key: string]: coercedValue
}


/**
 * Callback function for generating random key or value
 * @callback fuzzy_callback
 * @param {...any} args
 * @return {(number|string)}
 */
type fuzzy_callback = (...args: any[]) => number | string;


/**
 * Configuration object unwrapped by `Toxic_Cookies.constructor()` method
 * @typedef {Object} Configure_Toxic_Cookies
 * @property {string[]} clean_keys Array of key names to **not** poison values
 * @property {number} [max_bite_size=4090] Default `4090`, maximum bites allotted for cookies
 * @property {string} [path='/'] Default '/', URL path cookies are _bound_ to
 * @property {fuzzy_callback} key_callback
 * @property {fuzzy_callback} value_callback
 */
interface Configure_Toxic_Cookies {
  clean_keys?: string[];
  max_bite_size?: number;
  path?: string;
  key_callback?: fuzzy_callback;
  value_callback?: fuzzy_callback;
}


/**
 * Tool for poisoning browser cookies of currently loaded domain
 * @author S0AndS0
 * @license AGPL-3.0
 */
class Toxic_Cookies {
  clean_keys: string[];
  max_bite_size: number;
  path: string;
  key_callback: fuzzy_callback;
  value_callback: fuzzy_callback;

  /**
   * Initialize new instance of `Toxic_Cookies`
   * @param {Configure_Toxic_Cookies} - Configuration object to unwrap
   * @param {string[]} [Configure_Toxic_Cookies.clean_keys=[]]
   * @param {number} [Configure_Toxic_Cookies.max_bite_size=4090]
   * @param {string} [Configure_Toxic_Cookies.path='/']
   * @param {fuzzy_callback} [Configure_Toxic_Cookies.key_callback=() => { return Math.random(); }]
   * @param {fuzzy_callback} [Configure_Toxic_Cookies.value_callback=() => { return Math.random(); }]
   * @example
   * ```JavaScript
   * const toxic_cookies = new Toxic_Cookies({
   *   clean_keys: ['nan', 'auth'],
   *   max_bite_size: 4090,
   *   path: window.location.href,
   *   key_callback: () => { return Math.random(); },
   *   value_callback: () => { return Math.random(); },
   * });
   * ```
   * @TODO - @see Toxic_Cookies.poisonRemainingCookies
   */
  /* istanbul ignore next */
  constructor({
    clean_keys = [],
    max_bite_size = 4090,
    path = '/',
    key_callback = () => { return Math.random(); },
    value_callback = () => { return Math.random(); },
  }: Configure_Toxic_Cookies) {
    this.clean_keys = clean_keys;
    this.max_bite_size = max_bite_size;
    this.path = path;
    this.key_callback = key_callback;
    this.value_callback = value_callback;
  }

  /**
   * @param {number} [days=1]
   * @returns {number}
   * @example
   * ```javascript
   * Toxic_Cookies.calculateCookieExpiration(2);
   * //> "Sun, 27 Dec 2020 01:13:12 GMT"
   * ```
   */
  static calculateCookieExpiration(days: number = 1): string {
    days = Number(days) | 0;

    const date = new Date();
    const now = date.getTime();
    date.setTime(now + days * 24 * 60 * 60 * 1000);
    return date.toUTCString();
  }

  /**
   * @param {boolean} [coerce_values=false] Default `false`
   * @returns {coercedCookies}
   */
  static objectifyCookies(coerce_values: boolean = false): coercedCookies {
    return document.cookie.split(';').reduce((accumulator: { [key: string]: any }, cookie) => {
      /* istanbul ignore next */
      if (cookie.length) {
        const chunk: string[] = cookie.split('=');
        const key: string = chunk[0].trim();
        let value: coercedValue = chunk[1]? chunk[1].trim(): '';

        if (coerce_values === true) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            /* istanbul ignore next */
            if (!(e instanceof SyntaxError)) {
              throw e;
            }

            if ('undefined' === value) {
              value = undefined;
            } else if ('NaN' === value) {
              value = NaN;
            } else if ('Infinity' === value) {
              value = Infinity;
            }
            /* istanbul ignore next */
            else if ('-Infinity' === value) {
              value = -Infinity;
            }
          }
        }
        accumulator[key] = value;
      }

      return accumulator;
    }, {});
  }

  /**
   * Overwrites existing cookies, except those listed in `this.clean_keys`, with data from value callback function
   */
  poisonExistingCookies() {
    const expiration = this.constructor.calculateCookieExpiration();
    const cookie_metadata = `expires=${expiration};path=${this.path}`;
    const objectified_cookies = this.constructor.objectifyCookies();
    Object.entries(objectified_cookies).forEach(([key, value]) => {
      if (!this.clean_keys.includes(key)) {
        window.document.cookie = `${key}=${this.value_callback()};${cookie_metadata}`;
      }
    });
  }

  /**
   * Fills remaining space for cookies with data generated by key/value callback functions
   * @TODO - Figure out why NodeJS does not play nice with Blob
   */
  /* istanbul ignore next */
  poisonRemainingCookies() {
    const expiration = this.constructor.calculateCookieExpiration();

    while (new Blob([window.document.cookie]).size < this.max_bite_size) {
      const key = this.key_callback();
      const value = this.value_callback();
      window.document.cookie = `${key}=${value};expires=${expiration};path=${this.path}`;
    }
  }

  /**
   * Runs `this.poisonExistingCookies()` and `this.poisonRemainingCookies()` methods
   * @TODO - @see Toxic_Cookies.poisonRemainingCookies
   */
  /* istanbul ignore next */
  poisionAllCookies() {
    this.poisonExistingCookies();
    this.poisonRemainingCookies();
  }
}


/* istanbul ignore next */
if (typeof module !== 'undefined') {
  module.exports = Toxic_Cookies;
}

