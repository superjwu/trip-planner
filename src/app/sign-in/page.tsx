// Next 16 + Turbopack regression workaround: bare `/sign-in` doesn't match
// the `[[...rest]]/page.tsx` optional catch-all, so Clerk's auth.protect()
// redirect (which sends users here) hits a 404. This file handles the root
// segment; the catch-all keeps handling `/sign-in/sso-callback` etc.
export { default } from "./[[...rest]]/page";
