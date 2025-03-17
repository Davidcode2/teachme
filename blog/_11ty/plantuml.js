import plantuml from 'node-plantuml';
import fs from 'fs/promises';
import path from 'path';

export default function(eleventyConfig) {
  eleventyConfig.addTransform('plantuml', async function(content) {
    const withPlantUmlImage = await processPlantUml(content, eleventyConfig.dir.output || '_site');
    return withPlantUmlImage;
  });
};

async function processPlantUml(content, outputDir) {
  const umlBlocks = getUmlBlocks(content);
  let processedContent = content;
  if (!umlBlocks) {
    return processedContent;
  }
  console.log('Found PlantUML blocks:', umlBlocks);
  for (const umlBlockWithHtml of umlBlocks) {
    const umlCode = stripHtmlTags(umlBlockWithHtml);
    const replacement = await generateAndReplace(umlCode, outputDir);
    processedContent = processedContent.replace(umlBlockWithHtml, replacement);
  }
  return processedContent;
}

function getUmlBlocks(content) {
  const umlBlockRegex = /^<p>@startuml<\/p>\n(?:.*\n)+?^<p>@enduml<\/p>$/gm
  const umlBlocks = content.match(umlBlockRegex);
  return umlBlocks;
}

async function generateAndReplace(umlCode, outputDir) {
  const pngBuffer = await generatePng(umlCode);
  const uniqueFilename = `plantuml-${Date.now()}.png`;
  const imagePath = path.join(outputDir, uniqueFilename);
  const relativeImagePath = `/${uniqueFilename}`;

  await fs.writeFile(imagePath, pngBuffer);
  console.log('Saved PNG:', imagePath);

  const generatedHtml = generateHtml(relativeImagePath, umlCode);
  return generatedHtml;
}

async function generatePng(umlCode) {
  return new Promise((resolve, reject) => {
    const gen = plantuml.generate(umlCode, { format: 'png' });
    let buffer = Buffer.from([]);
    gen.out.on('data', (data) => {
      buffer = Buffer.concat([buffer, data]);
    });
    gen.out.on('end', () => {
      resolve(buffer);
    });
    gen.out.on('error', (err) => {
      reject(err);
    });
  });
}

function generateHtml(imagePath, umlCode) {
  return `
<div class="plantuml-container">
  <div class="tabs">
    <button class="tab-button active" data-tab="image">Image</button>
    <button class="tab-button" data-tab="code">Code</button>
  </div>
  <div class="tab-content" data-tab-content="image">
    <img src="${imagePath}" alt="PlantUML Diagram">
  </div>
  <div class="tab-content hidden" data-tab-content="code">
    <pre><code>${escapeHtml(umlCode)}</code></pre>
  </div>
</div>
<script>
  document.querySelectorAll('.plantuml-container .tab-button').forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab;
      document.querySelectorAll('.plantuml-container .tab-button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.plantuml-container .tab-content').forEach(content => content.classList.add('hidden'));
      button.classList.add('active');
      document.querySelector(\`.plantuml-container .tab-content[data-tab-content="\${tab}"]\`).classList.remove('hidden');
    });
  });
</script>

<style>
.plantuml-container {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}

.plantuml-container .tabs {
  display: flex;
}

.plantuml-container .tab-button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-bottom: none;
  cursor: pointer;
  background-color: #f0f0f0;
}

.plantuml-container .tab-button.active {
  background-color: #fff;
}

.plantuml-container .tab-content {
  padding: 10px;
  border: 1px solid #ccc;
  border-top: none;
}

.plantuml-container .tab-content.hidden {
  display: none;
}
</style>
`;
}

function greaterThanAndLessThan(text) {
  return text.replace(/&lt;/g, '<',).replace(/&gt;/g, '>');
}

function escapeHtml(text) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function stripHtmlTags(html) {
  const stripped = html.replace(/<[^>]*>/g, '');
  const withSymbols = greaterThanAndLessThan(stripped);
  return withSymbols;
}
