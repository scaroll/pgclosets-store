"use client";

import { generateLocalBusinessSchema } from './local-business-schema';

export function LocalBusinessJSONLD() {
  const schema = generateLocalBusinessSchema();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
