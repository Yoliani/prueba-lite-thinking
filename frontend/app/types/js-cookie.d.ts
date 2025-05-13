declare module 'js-cookie' {
  interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  }

  interface CookiesStatic {
    set(name: string, value: string | object, options?: CookieAttributes): string | undefined;
    get(name: string): string | undefined;
    get(): { [key: string]: string };
    remove(name: string, options?: CookieAttributes): void;
    withConverter(converter: Function): CookiesStatic;
    noConflict(): CookiesStatic;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}
