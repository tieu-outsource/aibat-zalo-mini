import { atom, selector, selectorFamily } from "recoil";
import { BaseVariant, Product, Variant } from "types/product";
import { getConfig } from "utils/config";

export const productsState = selector<Product[]>({
  key: "products",
  get: async () => {
    const url = getConfig((config) => config.api.baseUrl);
    const apiKey = getConfig((config) => config.api.apiKey);

    const response = await fetch(`${url}/products`, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();
    return data
  },
});

export const recommendProductsState = selector<Product[]>({
  key: "recommendProducts",
  get: async () => {
    const url = getConfig((config) => config.api.baseUrl);
    const apiKey = getConfig((config) => config.api.apiKey);

    const response = await fetch(`${url}/products/recommend`, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();
    return data
  },
});

export const productsByCategoryState = selectorFamily<Product[], number>({
  key: "productsByCategory",
  get:
    (categoryId) =>
      async () => {
        const url = getConfig((config) => config.api.baseUrl);
        const apiKey = getConfig((config) => config.api.apiKey);

        const response = await fetch(`${url}/products?category=${categoryId}`, {
          headers: {
            "x-api-key": apiKey,
          },
        });

        const data = await response.json();
        return data
      },
});

export const keywordState = atom({
  key: "keyword",
  default: "",
});

export const resultState = selector<Product[]>({
  key: "result",
  get: async ({ get }) => {
    const url = getConfig((config) => config.api.baseUrl);
    const apiKey = getConfig((config) => config.api.apiKey);
    const keyword = get(keywordState);

    const response = await fetch(`${url}/products?search=${keyword}`, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();
    return data
  },
});


export const variantsByProductState = selectorFamily<Variant[], number>({
  key: "variantsByProduct",
  get:
    (productId) =>
      async () => {
        const url = getConfig((config) => config.api.baseUrl);
        const apiKey = getConfig((config) => config.api.apiKey);

        const response = await fetch(`${url}/products/${productId}/variants`, {
          headers: {
            "x-api-key": apiKey,
          },
        });

        const data = await response.json();
        return data
      },
});
