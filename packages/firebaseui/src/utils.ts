import { spreadProps } from "@open-wc/lit-helpers";

export function spreadAttributes(attributes: NamedNodeMap) {
  const attrs: { [key: string]: any } = {};

  for (const attr of attributes) {
    attrs[attr.name] = attr.value;
  }

  return spreadProps(attrs);
}
