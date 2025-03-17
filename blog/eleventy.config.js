import { DateTime } from "luxon";
import markdownIt from "markdown-it";
import plantUmlPlugin from './_11ty/plantuml.js';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css/output.css");

  eleventyConfig.addFilter("formatDate", function(dateString, format) {
    const dateObj = DateTime.fromJSDate(new Date(dateString));
    if (!dateObj.isValid) {
      return "";
    }
    return dateObj.toFormat(format);
  });

  const markdownLibrary = markdownIt({
    html: true, // Allow HTML tags in Markdown
    linkify: true, // Autoconvert URLs to links
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  eleventyConfig.addPlugin(plantUmlPlugin);
}
