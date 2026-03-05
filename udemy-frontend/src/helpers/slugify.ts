export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")                 // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "")  // xóa dấu
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")      // thay ký tự lạ bằng -
    .replace(/(^-|-$)+/g, "");        // xóa - đầu/cuối
}