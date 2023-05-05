import 'preact';

declare module 'preact' {
  namespace JSX {
    interface IntrinsicAttributes {
      path?: string;
    }
  }
}
