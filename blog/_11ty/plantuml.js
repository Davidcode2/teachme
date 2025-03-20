import plantuml from "node-plantuml";
import fs from "fs/promises";
import path from "path";
import { exec } from 'child_process';

export default function (eleventyConfig) {
  eleventyConfig.addTransform("plantuml", async function (content) {
    const withPlantUmlImage = await processPlantUml(
      content,
      this.page.inputPath,
      eleventyConfig.dir.output || "_site"
    );
    return withPlantUmlImage;
  });
}

async function processPlantUml(content, inputPath, outputPath) {
  const umlBlocks = getUmlBlocks(content);
  let processedContent = content;
  if (!umlBlocks) {
    return processedContent;
  }
  console.log("Found PlantUML blocks:", umlBlocks);
  for (const umlBlockWithHtml of umlBlocks) {
    const umlCode = stripHtmlTags(umlBlockWithHtml);
    const replacement = await generateAndReplace(umlCode, inputPath, outputPath);
    processedContent = processedContent.replace(umlBlockWithHtml, replacement);
  }
  return processedContent;
}

function getUmlBlocks(content) {
  // these are blocks which are directly in the markdown content
  const umlBlockRegex = /^<p>@startuml<\/p>\n(?:.*\n)+?^<p>@enduml<\/p>$/gm;
  // these are blocks enclosed in ```plantuml code blocks
  const codeBlockPlantumlRegex = /^<pre><code class="language-plantuml">@startuml\n(?:.*\n)+?^@enduml\n<\/code><\/pre>$/gm;

  const umlBlocks = content.match(umlBlockRegex);
  const codeBlocks = content.match(codeBlockPlantumlRegex);
  if (!umlBlocks) {
    return null;
  }
  const allPlantUmlBlocks = umlBlocks.concat(codeBlocks);
  return allPlantUmlBlocks;
}

async function generateAndReplace(umlCode, inputPath, outputPath) {
  const imagePath = await generatePngWithLocalPlantUml(umlCode, inputPath, outputPath);
  const imageOutputPath = path.join(outputPath, imagePath);
  await fs.copyFile(imagePath, imageOutputPath);

  const relativeImagePath = `/${imagePath}`;
  console.log("Generated PlantUML image:", relativeImagePath);
  const generatedHtml = generateHtml(relativeImagePath, umlCode);
  return generatedHtml;
}

async function generatePngWithLocalPlantUml(umlCode, imagePath) {
  const fileName = path.basename(imagePath, path.extname(imagePath));
  console.log("uml code", umlCode);
  return new Promise((resolve, reject) => {
    const tempFile = path.join(path.dirname(imagePath), `${fileName}-${Date.now()}.txt`);

    fs.writeFile(tempFile, umlCode)
      .then(() => {
        exec(`java -jar ~/.plantuml/plantuml.jar -tpng -o "./" "${tempFile}"`, (error, stdout, stderr) => {
          fs.unlink(tempFile);
          if (error) {
            console.error(`exec error: ${error}`);
            reject(error);
            return;
          }
          resolve(tempFile.replace(".txt", ".png"));
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
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
<div class="plantuml-container" style="margin: 20px 0" id="${uniqueId}">
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

function replaceEscapedCharacters(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

function escapeHtml(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function stripHtmlTags(html) {
  const stripped = html.replace(/<[^>]*>/g, "");
  const withSymbols = replaceEscapedCharacters(stripped);
  return withSymbols;
}
