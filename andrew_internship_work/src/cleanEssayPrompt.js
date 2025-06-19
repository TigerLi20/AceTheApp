// Clean up essay prompts by removing duplicates and formatting properly
export function cleanEssayPrompt(text) {
  if (!text) return text;
  
  let lines = text.split(/\r?\n/);
  
  function processBlock(blockLines) {
    const isQuestionBlock = blockLines[0] && /^\d+\./.test(blockLines[0]);
    
    // Remove standalone 'Option N' lines
    let cleaned = [];
    for (let i = 0; i < blockLines.length; i++) {
      const line = blockLines[i];
      
      if (/^Option ?\d+[:]?\s*$/.test(line)) {
        // Skip standalone option lines and following empty lines
        while (i + 1 < blockLines.length && !blockLines[i + 1].trim()) i++;
        continue;
      }
      
      cleaned.push(line);
    }
    
    // Remove duplicate content (first occurrence of lines that appear later)
    let final = [];
    for (let i = 0; i < cleaned.length; i++) {
      const line = cleaned[i];
      if (!line.trim()) {
        final.push(line);
        continue;
      }
      
      // Skip if this line appears later as substring
      let foundLater = false;
      for (let j = i + 1; j < cleaned.length; j++) {
        if (cleaned[j].includes(line)) {
          foundLater = true;
          break;
        }
      }
      
      if (!foundLater) final.push(line);
    }
    
    // Format multi-option questions
    let formatted = [];
    for (const line of final) {
      const optionMatch = line.match(/^(Option ?\d+)(.+)/);
      
      if (optionMatch) {
        formatted.push(optionMatch[1] + ":");
        formatted.push(optionMatch[2].trim());
        formatted.push("");
      } else {
        formatted.push(line);
      }
    }
    
    // Add separator for questions
    if (isQuestionBlock) {
      const headingIdx = formatted.findIndex(line => line.trim());
      if (headingIdx !== -1) {
        formatted.splice(headingIdx + 1, 0, "--------------------", "");
      }
    }
    
    // Remove trailing empty lines
    while (formatted.length && !formatted[formatted.length - 1].trim()) {
      formatted.pop();
    }
    
    return formatted;
  }
  
  // Split into blocks by headings
  let blocks = [];
  let current = [];
  
  for (const line of lines) {
    if (/^(\d+\.|ESSAY PROMPTS|COLLEGE:|Applicant:|Year:|^\s*[-=]{3,}\s*$)/.test(line) && current.length) {
      blocks.push(current);
      current = [];
    }
    current.push(line);
  }
  if (current.length) blocks.push(current);
  
  // Process and join
  return blocks
    .map(processBlock)
    .flat()
    .join("\n")
    .replace(/(-{15,}\s*\n\s*){2,}/g, "--------------------\n\n") // Remove duplicate separators
    .replace(/(Your Response:)/g, '$1\n\n\n'); // Add three line breaks after 'Your Response:'
}