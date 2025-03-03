import { DateTime } from "luxon";

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css/output.css");

  eleventyConfig.addFilter("formatDate", function(dateString, format) {
    const dateObj = DateTime.fromJSDate(new Date(dateString));
    if (!dateObj.isValid) {
      return "";
    }
    return dateObj.toFormat(format);
  });
}
