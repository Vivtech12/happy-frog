import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";
import { parse as parseCsv } from "csv-parse/sync";

// Define the electronics collection from CSV file
const electronics = defineCollection({
  loader: file("src/data/amazon_electronics_sample.csv", {
    parser: (text) => {
      const rows = parseCsv(text, {
        columns: true,
        skipEmptyLines: true,
        trim: true
      });

      // Add id field to each row and track used IDs to ensure uniqueness
      const usedIds = new Set<string>();
      return rows.map((row: any, index) => {
        // Create a slug from the product title for the ID
        let slug = row.product_title
          ? row.product_title
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim()
          : '';

        // Fallback for empty or invalid slugs
        if (!slug || slug.length === 0) {
          slug = `product-${index}`;
        }

        // Ensure ID is unique by adding index suffix if needed
        let finalSlug = slug;
        let suffix = 1;
        while (usedIds.has(finalSlug)) {
          finalSlug = `${slug}-${suffix}`;
          suffix++;
        }
        usedIds.add(finalSlug);

        return {
          ...row,
          id: finalSlug
        };
      });
    }
  }),
  schema: z.object({
    product_title: z.string(),
    product_rating: z.string(),
    total_reviews: z.string(),
    purchased_last_month: z.string(),
    discounted_price: z.string(),
    original_price: z.string(),
    is_best_seller: z.string(),
    is_sponsored: z.string(),
    has_coupon: z.string(),
    buy_box_availability: z.string(),
    delivery_date: z.string(),
    sustainability_tags: z.string(),
    product_image_url: z.string(),
    product_page_url: z.string(),
    data_collected_at: z.string(),
    product_category: z.string(),
    discount_percentage: z.string(),
  }).transform(data => ({
    ...data,
    // Convert string fields to numbers with error handling
    product_rating: data.product_rating ? Number(data.product_rating) : 0,
    total_reviews: data.total_reviews ? Number(data.total_reviews) : 0,
    purchased_last_month: data.purchased_last_month ? Number(data.purchased_last_month) : 0,
    discounted_price: data.discounted_price ? Number(data.discounted_price.replace(/[^0-9.]/g, '')) : 0,
    original_price: data.original_price ? Number(data.original_price.replace(/[^0-9.]/g, '')) : 0,
    discount_percentage: data.discount_percentage ? Number(data.discount_percentage.replace(/[^0-9.]/g, '')) : 0,
    // Convert boolean-like strings to actual booleans
    is_best_seller: data.is_best_seller === 'true' || data.is_best_seller === '1' || data.is_best_seller === 'TRUE',
    is_sponsored: data.is_sponsored === 'true' || data.is_sponsored === '1' || data.is_sponsored === 'TRUE',
    has_coupon: data.has_coupon === 'true' || data.has_coupon === '1' || data.has_coupon === 'TRUE',
  }))
});

export const collections = {
  electronics,
};