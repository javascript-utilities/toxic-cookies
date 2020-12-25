#!/usr/bin/env node
/**
 * @author S0AndS0
 * @license AGPL-3.0
 */


'use strict';


/**
 * @note - NodeJS does not have Blob object by default
 * @see {link} - https://www.npmjs.com/package/cross-blob
 */
globalThis.Blob = require('cross-blob');


/**
 * Mocks cookies
 * @see {link} - https://stackoverflow.com/questions/50761393/how-to-mock-cookie-getlanguage-in-jest
 */
Object.defineProperty(window.document, 'cookie', {
  writable: true,
  value: '',
});


/**
 * Enables static methods to be called from within class methods
 * @see {link} - https://github.com/Microsoft/TypeScript/issues/3841
 */
interface Toxic_Cookies__Test {
  constructor: typeof Toxic_Cookies__Test;
}


/**
 * Tests methods for instance(s) of `Toxic_Cookies` class
 */
class Toxic_Cookies__Test {
  toxicCookies: Toxic_Cookies;

  constructor() {
    this.toxicCookies = new (require('../toxic-cookies.js'))({clean_keys: ['nan']});
  }

  /**
   *
   */
  static appendCookie(key: string, value: any) {
    if (window.document.cookie.length > 0) {
      window.document.cookie += `;${key}=${value}`;
    } else {
      window.document.cookie = `${key}=${value}`;
    }
  }

  /**
   * @TODO - @see Toxic_Cookies.poisonRemainingCookies
   */
  runTests() {
    this.testsConstructor();
    this.testsCalculateCookieExpiration();
    this.testsObjectifyCookies();
    this.testsPoisonExistingCookies();
    // this.testsPoisonRemainingCookies();
    // this.testsPoisionAllCookies();
  }

  /**
   *
   */
  testsConstructor() {
    test('constructor -> Defaults are correctly assigned?', () => {
      const toxicCookies = new (require('../toxic-cookies.js'))({});
      expect(toxicCookies.clean_keys).toStrictEqual([]);
      expect(toxicCookies.max_bite_size).toEqual(4090);
      expect(toxicCookies.path).toEqual('/');
    });

    test('constructor -> Defaults can be overwritten?', () => {
      const toxicCookies = new (require('../toxic-cookies.js'))({
        clean_keys: ['nan'],
        max_bite_size: 5000,
        path: '/example'
      });

      expect(toxicCookies.clean_keys).toStrictEqual(['nan']);
      expect(toxicCookies.max_bite_size).toEqual(5000);
      expect(toxicCookies.path).toEqual('/example');
    });
  }

  /**
   *
   */
  testsCalculateCookieExpiration() {
    test('calculateCookieExpiration -> Cookie experation `undefined` is greater than `0`?', () => {
      const expiration_string = this.toxicCookies.constructor.calculateCookieExpiration(undefined);
      const expiration_date = new Date(expiration_string);
      const date = new Date();
      date.setTime(date.getTime() + 0 * 24 * 60 * 60 * 1000);

      expect(expiration_date.getTime()).toBeCloseTo(date.getTime(), -9);
    });

    test('calculateCookieExpiration -> Cookie experation `NaN` defaults to number?', () => {
      const expiration_string = this.toxicCookies.constructor.calculateCookieExpiration(NaN);
      const expiration_date = new Date(expiration_string);
      const date = new Date();
      date.setTime(date.getTime() + 0 * 24 * 60 * 60 * 1000);

      expect(expiration_date.getTime()).toBeCloseTo(date.getTime(), -5);
    });

    test('calculateCookieExpiration -> Cookie experation `2` is acceptable?', () => {
      const expiration_string = this.toxicCookies.constructor.calculateCookieExpiration(2);
      const expiration_date = new Date(expiration_string);
      const date = new Date();
      date.setTime(date.getTime() + 2 * 24 * 60 * 60 * 1000);

      expect(expiration_date.getTime()).toBeCloseTo(date.getTime(), -7);
    });

    test('calculateCookieExpiration -> Cookie experation `4.2` is coerced to integer?', () => {
      const expiration_string = this.toxicCookies.constructor.calculateCookieExpiration(4.2);
      const expiration_date = new Date(expiration_string);
      const date = new Date();
      date.setTime(date.getTime() + 4 * 24 * 60 * 60 * 1000);

      expect(expiration_date.getTime()).toBeCloseTo(date.getTime(), -7);
    });

    test('calculateCookieExpiration -> Cookie experation `0` defaults to positive integer?', () => {
      const expiration_string = this.toxicCookies.constructor.calculateCookieExpiration(0);
      const expiration_date = new Date(expiration_string);
      const date = new Date();
      date.setTime(date.getTime() + 0 * 24 * 60 * 60 * 1000);

      expect(expiration_date.getTime()).toBeCloseTo(date.getTime(), -7);
    });
  }

  /**
   *
   */
  testsObjectifyCookies() {
    const array_data = [1, 'two', false];
    const array_json = JSON.stringify(array_data);

    this.constructor.appendCookie('array', array_json);
    test('objectifyCookies -> Is JSON encoded Array retrievable?', () => {
      expect(this.toxicCookies.constructor.objectifyCookies()['array']).toStrictEqual(array_json);
    });
    test('objectifyCookies -> Does coercion of Array values function?', () => {
      expect(this.toxicCookies.constructor.objectifyCookies(true)['array']).toStrictEqual(array_data);
    });

    this.constructor.appendCookie('undefined', undefined);
    test('objectifyCookies -> Is encoded undefined retrievable?', () => {
      expect(this.toxicCookies.constructor.objectifyCookies()['undefined']).toEqual("undefined");
    });
    test('objectifyCookies -> Does coercion of undefined values function?', () => {
      expect(this.toxicCookies.constructor.objectifyCookies(true)['undefined']).toEqual(undefined);
    });

    this.constructor.appendCookie('nan', NaN);
    test('objectifyCookies -> Is JSON encoded NaN retrievable?', () => {
      expect(this.toxicCookies.constructor.objectifyCookies()['nan']).toBe('NaN');
    });
    test('objectifyCookies -> Does coercion of NaN values function?', () => {
      expect(this.toxicCookies.constructor.objectifyCookies(true)['nan']).toBe(NaN);
    });

    this.constructor.appendCookie('infinity', Infinity);
    test('objectifyCookies -> Is JSON encoded Infinity retrievable?', () => {
      expect(this.toxicCookies.constructor.objectifyCookies()['infinity']).toBe('Infinity');
    });
    test('objectifyCookies -> Does coercion of Infinity values Function?', () => {
      expect(this.toxicCookies.constructor.objectifyCookies(true)['infinity']).toBe(Infinity);
    });

    this.constructor.appendCookie('-infinity', -Infinity);
    test('objectifyCookies -> Is JSON encoded -Infinity retrievable?', () => {
      expect(this.toxicCookies.constructor.objectifyCookies()['-infinity']).toBe('-Infinity');
    });
    test('objectifyCookies -> Does coercion of -Infinity values Function?', () => {
      expect(this.toxicCookies.constructor.objectifyCookies(true)['-infinity']).toBe(-Infinity);
    });
  }

  /**
   *
   */
  testsPoisonExistingCookies() {
    test('poisonExistingCookies -> Poisoning existing cookies does not throw an error?', () => {
      expect(this.toxicCookies.poisonExistingCookies()).toBeUndefined();
    });
  }

  /**
   * @TODO - @see Toxic_Cookies.poisonRemainingCookies
   */
  testsPoisonRemainingCookies() {
    test('poisonRemainingCookies -> Poisining remaining cookies does not throw an error?', () => {
      expect(this.toxicCookies.poisonRemainingCookies()).toBeUndefined();
    });
  }

  /**
   * @TODO - @see Toxic_Cookies.poisonRemainingCookies
   */
  testsPoisionAllCookies() {
    test('poisionAllCookies -> Poisioning all cookies does not throw an error?', () => {
      expect(this.toxicCookies.poisionAllCookies()).toBeUndefined();
    });
  }
}


/**
 * Runs tests that would otherwise conflict with testing other features
 */
class Toxic_Cookies__Test_Edgecases {
  toxicCookies: Toxic_Cookies;

  constructor() {
    this.toxicCookies = new (require('../toxic-cookies.js'))({clean_keys: ['nan']});
  }

  /**
   *
   */
  runTests() {
    this.testsEdgeCases();
  }

  /**
   *
   */
  testsEdgeCases() {
    test('testsEdgeCases -> Do no cookies result in an empty object?', () => {
      window.document.cookie = '';
      expect(this.toxicCookies.constructor.objectifyCookies()).toEqual({});
    });
  }
}


const test__toxic_cookies = new Toxic_Cookies__Test();
test__toxic_cookies.runTests();

const test_edgecases__toxic_cookies = new Toxic_Cookies__Test_Edgecases();
test_edgecases__toxic_cookies.runTests();

