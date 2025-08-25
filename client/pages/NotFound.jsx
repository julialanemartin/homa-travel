import React from "react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>Try the <Link href="/">home page</Link>.</p>
    </section>
  );
}
