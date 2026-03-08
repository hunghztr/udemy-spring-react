export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")                 // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "")  // xóa dấu
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")      // thay ký tự lạ bằng -
    .replace(/(^-|-$)+/g, "");        // xóa - đầu/cuối
}

// lấy name từ slug
export function getCategorySlug(slug?: string) {
  if (!slug) return "";

  return slug
    .replace(".html", "")
    .split("-")
    .slice(0, -5) // bỏ UUID
    .join("-");
}

export function formatCategoryName(slug?: string) {
  if (!slug) return "";

  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}