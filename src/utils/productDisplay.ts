import type { Product } from "@/types/product";

export type TowelDisplayType =
  | "Toalla de baño"
  | "Toalla de mano"
  | "Toalla de piso"
  | "Batas"
  | "Paquete";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getProductDisplayType(
  product: Pick<Product, "name" | "categoryName">
): TowelDisplayType {
  const source = normalize(`${product.name} ${product.categoryName}`);

  if (
    source.includes("set") ||
    source.includes("paquete") ||
    source.includes("pack")
  ) {
    return "Paquete";
  }

  if (
    source.includes("bata") ||
    source.includes("robe") ||
    source.includes("spa")
  ) {
    return "Batas";
  }

  if (
    source.includes("piso") ||
    source.includes("bath mat") ||
    source.includes("alfombra")
  ) {
    return "Toalla de piso";
  }

  if (
    source.includes("mano") ||
    source.includes("facial") ||
    source.includes("hand towel")
  ) {
    return "Toalla de mano";
  }

  if (
    source.includes("bano") ||
    source.includes("bath towel") ||
    source.includes("toalla")
  ) {
    return "Toalla de baño";
  }

  return "Toalla de baño";
}

export function getGramaje(
  product: Pick<Product, "name" | "categoryName">
): string {
  const type = getProductDisplayType(product);

  if (type === "Toalla de piso") return "750 g/m²";
  return "700 g/m²";
}

export function getBenefitCopy(
  product: Pick<Product, "name" | "categoryName">
): string {
  const type = getProductDisplayType(product);

  if (type === "Toalla de piso") {
    return "Ideal para baño por su absorción superior, textura firme y mayor resistencia al uso diario.";
  }

  if (type === "Toalla de mano") {
    return "Perfecta para uso diario por su suavidad al tacto, secado eficiente y fácil mantenimiento.";
  }

  if (type === "Paquete") {
    return "Solución práctica y completa para equipamiento textil, ideal para compras integrales y necesidades de mayor volumen.";
  }

  if (type === "Batas") {
    return "Batas diseñadas para brindar confort, suavidad y una presentación elegante en el hogar, spa u hotel.";
  }

  return "Diseñada para brindar suavidad, alta absorción y durabilidad en el uso diario del hogar.";
}

export function getPresentationOptions(
  product: Pick<Product, "name" | "categoryName">
): string[] {
  const type = getProductDisplayType(product);

  if (type === "Toalla de baño") return ["70 x 140 cm", "90 x 150 cm"];
  if (type === "Toalla de mano") return ["40 x 70 cm"];
  if (type === "Toalla de piso") return ["50 x 70 cm"];
  if (type === "Batas") return ["Talla estándar", "Talla hotelera"];
  if (type === "Paquete") return ["Presentación completa", "Pack corporativo"];

  return ["Presentación estándar"];
}
