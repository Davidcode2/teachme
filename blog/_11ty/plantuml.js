import plantuml from "node-plantuml";
import fs from "fs/promises";
import path from "path";

export default function (eleventyConfig) {
  eleventyConfig.addTransform("plantuml", async function (content) {
    const withPlantUmlImage = await processPlantUml(
      content,
      eleventyConfig.dir.output || "_site",
    );
    return withPlantUmlImage;
  });
}

async function processPlantUml(content, outputDir) {
  const umlBlocks = getUmlBlocks(content);
  let processedContent = content;
  if (!umlBlocks) {
    return processedContent;
  }
  console.log("Found PlantUML blocks:", umlBlocks);
  for (const umlBlockWithHtml of umlBlocks) {
    const umlCode = stripHtmlTags(umlBlockWithHtml);
    const replacement = await generateAndReplace(umlCode, outputDir);
    processedContent = processedContent.replace(umlBlockWithHtml, replacement);
  }
  return processedContent;
}

function getUmlBlocks(content) {
  const umlBlockRegex = /^<p>@startuml<\/p>\n(?:.*\n)+?^<p>@enduml<\/p>$/gm;
  const umlBlocks = content.match(umlBlockRegex);
  return umlBlocks;
}

async function generateAndReplace(umlCode, outputDir) {
  const pngBuffer = await generatePng(umlCode);
  const uniqueFilename = `plantuml-${Date.now()}.png`;
  const imagePath = path.join(outputDir, uniqueFilename);
  const relativeImagePath = `/${uniqueFilename}`;

  await fs.writeFile(imagePath, pngBuffer);
  console.log("Saved PNG:", imagePath);

  const generatedHtml = generateHtml(relativeImagePath, umlCode);
  return generatedHtml;
}

async function generatePng(umlCode) {
  return new Promise((resolve, reject) => {
    const gen = plantuml.generate(umlCode, { format: "png" });
    let buffer = Buffer.from([]);
    gen.out.on("data", (data) => {
      buffer = Buffer.concat([buffer, data]);
    });
    gen.out.on("end", () => {
      resolve(buffer);
    });
    gen.out.on("error", (err) => {
      reject(err);
    });
  });
}

function generateHtml(imagePath, umlCode) {
  const uniqueId = `plantuml-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return `
<div class="plantuml-container" id="${uniqueId}">
  <div class="tabs">
    <button class="tab-button active" data-tab="image-${uniqueId}">Image</button>
    <button class="tab-button" data-tab="code-${uniqueId}">Code</button>
  </div>
  <div class="tab-content" data-tab-content="image-${uniqueId}">
    <img src="${imagePath}" alt="PlantUML Diagram">
  </div>
  <div class="tab-content hidden" data-tab-content="code-${uniqueId}">
    <pre><code>${escapeHtml(umlCode)}</code></pre>
  </div>
</div>
<script>
  (function() {
    const container = document.getElementById('${uniqueId}');
    const buttons = container.querySelectorAll('.tab-button');
    const contents = container.querySelectorAll('.tab-content');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        buttons.forEach(btn => btn.classList.remove('active'));
        contents.forEach(content => content.classList.add('hidden'));
        button.classList.add('active');
        container.querySelector('.tab-content[data-tab-content="' + tab + '"]').classList.remove('hidden');
      });
    });
  })();
</script>
`;
}

function greaterThanAndLessThan(text) {
  return text.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function escapeHtml(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function stripHtmlTags(html) {
  const stripped = html.replace(/<[^>]*>/g, "");
  const withSymbols = greaterThanAndLessThan(stripped);
  return withSymbols;
}
