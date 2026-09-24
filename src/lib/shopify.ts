import { toast } from "sonner";

const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_PERMANENT_DOMAIN = "polyglot-path-k0cch-evxxntj0.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "3256fc8358f7de07095485d58a198a40";

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (response.status === 402) {
    toast.error("Shopify : paiement requis", {
      description: "L'accès à la boutique nécessite un abonnement Shopify actif.",
    });
    return null;
  }
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  if (data.errors) throw new Error(data.errors.map((e: { message: string }) => e.message).join(", "));
  return data;
}

const PRODUCTS_QUERY = `
  query Products { products(first: 50) { edges { node { id handle tags variants(first: 1) { edges { node { id } } } } } } }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

function formatCheckoutUrl(checkoutUrl: string) {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

type ProductEdge = { node: { tags: string[]; variants: { edges: Array<{ node: { id: string } }> } } };

/** Crée un panier Shopify (Storefront API) et renvoie l'URL de paiement. */
export async function createShopifyCheckout(
  items: Array<{ slug: string; title: string; sessionLabel?: string | null }>,
): Promise<string | null> {
  const products = await storefrontApiRequest(PRODUCTS_QUERY);
  if (!products) return null;
  const edges: ProductEdge[] = products.data.products.edges;

  const lines = items.map((item) => {
    const match = edges.find((e) => e.node.tags.includes(item.slug));
    const variantId = match?.node.variants.edges[0]?.node.id;
    if (!variantId) throw new Error(`Cours indisponible sur la boutique : ${item.title}`);
    return {
      quantity: 1,
      merchandiseId: variantId,
      attributes: item.sessionLabel ? [{ key: "Créneau", value: item.sessionLabel }] : [],
    };
  });

  const data = await storefrontApiRequest(CART_CREATE_MUTATION, { input: { lines } });
  if (!data) return null;
  const errors = data.data.cartCreate.userErrors;
  if (errors?.length) throw new Error(errors[0].message);
  const url = data.data.cartCreate.cart?.checkoutUrl;
  return url ? formatCheckoutUrl(url) : null;
}
