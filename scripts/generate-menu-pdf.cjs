/**
 * Run this script with Node.js to generate a basic text-based PDF menu.
 * Uses no external dependencies — writes raw PDF format.
 * Output: public/menu.pdf
 */

const MENU = [
  { category: "Starters", items: [
    ["Veg Spring Rolls", "₹180"], ["Paneer Tikka", "₹320"], ["Hara Bhara Kebab", "₹280"],
    ["Chicken Tikka", "₹380"], ["Fish Fingers", "₹450"],
  ]},
  { category: "Soups", items: [
    ["Tomato Soup", "₹150"], ["Sweet Corn Soup", "₹170"], ["Hot & Sour Soup", "₹180"],
    ["Chicken Clear Soup", "₹220"],
  ]},
  { category: "Vegetarian Mains", items: [
    ["Dal Tadka", "₹250"], ["Dal Makhani", "₹320"], ["Jeera Aloo", "₹220"],
    ["Mix Veg Curry", "₹280"], ["Kadai Paneer", "₹340"], ["Shahi Paneer", "₹350"],
    ["Paneer Butter Masala", "₹360"], ["Palak Paneer", "₹340"], ["Malai Kofta", "₹360"],
  ]},
  { category: "Non-Vegetarian Mains", items: [
    ["Butter Chicken", "₹520"], ["Chicken Curry", "₹480"], ["Kadai Chicken", "₹500"],
    ["Chicken Tikka Masala", "₹540"], ["Mutton Rogan Josh", "₹680"], ["Fish Curry", "₹580"],
  ]},
  { category: "Rice & Biryani", items: [
    ["Steamed Rice", "₹180"], ["Jeera Rice", "₹220"], ["Veg Pulao", "₹260"],
    ["Veg Biryani", "₹320"], ["Chicken Biryani", "₹480"], ["Mutton Biryani", "₹620"],
  ]},
  { category: "Breads", items: [
    ["Tandoori Roti", "₹35"], ["Butter Roti", "₹45"], ["Butter Naan", "₹80"],
    ["Garlic Naan", "₹110"], ["Lachha Paratha", "₹100"],
  ]},
  { category: "Chinese", items: [
    ["Veg Hakka Noodles", "₹260"], ["Chicken Hakka Noodles", "₹340"],
    ["Veg Fried Rice", "₹250"], ["Chicken Fried Rice", "₹320"],
  ]},
  { category: "Desserts & Beverages", items: [
    ["Gulab Jamun (2 pcs)", "₹120"], ["Brownie with Ice Cream", "₹260"],
    ["Cold Coffee", "₹180"], ["Fresh Lime Soda", "₹90"],
  ]},
];

// Simple PDF generator — no dependencies
function makePDF() {
  const objects = [];
  let objectCount = 0;

  function addObject(content) {
    objectCount++;
    objects.push({ num: objectCount, content });
    return objectCount;
  }

  // Build text content
  let lines = [];
  lines.push("THE DEN");
  lines.push("McLeod Ganj, Dharamshala, Himachal Pradesh");
  lines.push("Phone: +91 85870 44000");
  lines.push("Open Daily: 8:00 AM - 11:00 PM");
  lines.push("");
  lines.push("= = = = = = = = = = = = = = = = = = = = =");
  lines.push("                    MENU");
  lines.push("= = = = = = = = = = = = = = = = = = = = =");
  lines.push("");

  for (const cat of MENU) {
    lines.push("");
    lines.push(`--- ${cat.category.toUpperCase()} ---`);
    lines.push("");
    for (const [name, price] of cat.items) {
      const padding = " ".repeat(Math.max(1, 40 - name.length - price.length));
      lines.push(`  ${name}${padding}${price}`);
    }
  }

  lines.push("");
  lines.push("= = = = = = = = = = = = = = = = = = = = =");
  lines.push("Prices inclusive of all taxes.");
  lines.push("WhatsApp us to reserve: wa.me/918587044000");
  lines.push("= = = = = = = = = = = = = = = = = = = = =");

  // Encode text content as PDF stream
  // Using Helvetica (built-in PDF font, no embedding needed)
  const textOps = [];
  textOps.push("BT");
  textOps.push("/F1 16 Tf");
  textOps.push("50 780 Td");
  textOps.push("16 TL");

  for (const line of lines) {
    // Escape special chars for PDF
    const escaped = line.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    // Replace ₹ with Rs. for PDF compatibility (Helvetica doesn't have ₹)
    const clean = escaped.replace(/₹/g, "Rs.");
    textOps.push(`(${clean}) '`);
  }
  textOps.push("ET");

  const streamContent = textOps.join("\n");

  // PDF structure
  const catalogNum = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesNum = addObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  const pageNum = addObject(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 5 0 R /Resources << /Font << /F1 4 0 R >> >> >>`
  );
  const fontNum = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>"
  );
  const streamNum = addObject(
    `<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`
  );

  // Build PDF
  let pdf = "%PDF-1.4\n";
  const offsets = [];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += `${obj.num} 0 obj\n${obj.content}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += "xref\n";
  pdf += `0 ${objectCount + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  pdf += "trailer\n";
  pdf += `<< /Size ${objectCount + 1} /Root 1 0 R >>\n`;
  pdf += "startxref\n";
  pdf += `${xrefOffset}\n`;
  pdf += "%%EOF\n";

  return pdf;
}

const fs = require("fs");
const path = require("path");
const pdf = makePDF();
const outPath = path.join(__dirname, "..", "public", "menu.pdf");
fs.writeFileSync(outPath, pdf);
console.log(`PDF written to ${outPath} (${pdf.length} bytes)`);
