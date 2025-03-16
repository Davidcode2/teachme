const plantuml = require('node-plantuml');
const fs = require('fs').promises;
const path = require('path');

module.exports = function(eleventyConfig) {
  eleventyConfig.addTransform('plantuml', async function(content, outputPath) {
    if (!outputPath.endsWith('.html')) {
      return content;
    }

    return await processPlantUml(content, eleventyConfig.dir.output || '_site');
  });
};

async function processPlantUml(content, outputDir) {
  const startTag = '@startuml';
  const endTag = '@enduml';
  const startRegex = /^@startuml$/m;
  const endRegex = /^@enduml$/m;

  let processedContent = content;
  let startIndex = processedContent.indexOf(startTag);

  while (startIndex !== -1) {
    const { endIndex, umlCodeWithHtml } = findUmlBlock(processedContent, startIndex, startTag, endTag);
    console.log('Found PlantUML block:', umlCodeWithHtml);
    console.log('End index:', endIndex);

    if (endIndex === -1) {
      break; // No matching end tag, stop processing.
    }

    umlCode = stripHtmlTags(umlCodeWithHtml);
    console.log('PlantUML code:', umlCode);

    if (umlCode.match(startRegex) && umlCode.match(endRegex)) {
      console.log('Processing PlantUML block...');
      try {
        const replacement = await generateAndReplace(umlCode, outputDir);
        processedContent = processedContent.replace(umlCode, replacement);
      } catch (err) {
        console.error('Error processing PlantUML:', err);
        processedContent = processedContent.replace(umlCode, `<pre><code>${escapeHtml(umlCode)}</code></pre>`);
      }
    }

    startIndex = processedContent.indexOf(startTag, startIndex + 1);
  }

  return processedContent;
}

function findUmlBlock(content, startIndex, startTag, endTag) {
  let endIndex = -1;
  let currentStartIndex = startIndex + startTag.length;
  let openUmlBlocks = 1;

  while (openUmlBlocks > 0 && currentStartIndex < content.length) {
    let potentialEndIndex = content.indexOf(endTag, currentStartIndex);
    let potentialStartIndex = content.indexOf(startTag, currentStartIndex);

    if (potentialEndIndex === -1) {
      break;
    }

    if (potentialStartIndex !== -1 && potentialStartIndex < potentialEndIndex) {
      openUmlBlocks++;
      currentStartIndex = potentialStartIndex + startTag.length;
    } else {
      openUmlBlocks--;
      if (openUmlBlocks === 0) {
        endIndex = potentialEndIndex;
      }
      currentStartIndex = potentialEndIndex + endTag.length;
    }
  }

  const umlCodeWithHtml = endIndex !== -1 ? content.substring(startIndex, endIndex + endTag.length) : '';
  return { endIndex, umlCodeWithHtml };
}

async function generateAndReplace(umlCode, outputDir) {
  const pngBuffer = await generatePng(umlCode);
  console.log('Generated PNG:', pngBuffer);
  const uniqueFilename = `plantuml-${Date.now()}.png`;
  const imagePath = path.join(outputDir, uniqueFilename);
  const relativeImagePath = `/${uniqueFilename}`;

  await fs.writeFile(imagePath, pngBuffer);
  console.log('Saved PNG:', imagePath);

  return generateHtml(relativeImagePath, umlCode);
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
