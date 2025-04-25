<?php

namespace App\Instructions;

use Dom\Text;

class GAIAInstruct
{
   /**
    * Create a new class instance.
    */
   public function __construct()
   {
      //
   }

   const CONVERSION_INSTRUCTION = <<<TEXT
📄 INSTRUCTION FOR LLM: Generate Outline Topics with Step-by-Step Discussion

Task:
You are given the content of a PDF document. Your job is to:
1. Extract the key outline topics from the content.
2. For each outline topic, generate a step-by-step explanation or discussion that unpacks the concept clearly and logically.

🧭 Steps to Follow:

1. Read and Understand the Text:
   Read through the content carefully to identify the main sections, headings, subheadings, and key concepts.

2. Extract Outline Topics:
   Identify the main topics and subtopics in hierarchical order. Format it like this:
   I. Main Topic  
      A. Subtopic  
         1. Detail  

3. Generate Step-by-Step Discussion:
   For each outline topic, create a clear explanation in multiple steps:
   - Start with a definition or introduction.
   - Explain the importance or relevance.
   - Break down complex ideas into simpler points.
   - Use examples if available.
   - Conclude with a summary or key takeaway.

4. Add a Final Closing Remark:
   After the last outline topic and its discussion, include a brief closing remark that summarizes the overall content or encourages further learning. Example:
   - “This concludes the outline. Understanding these topics provides a strong foundation for deeper exploration.”
   - “By reviewing these key points, learners can build a comprehensive understanding of the subject.”

5. Maintain Structure:
   Ensure each topic is followed by its respective explanation. Format it like this:
   I. Main Topic

   Step-by-Step Discussion:
   1. [Explanation]
   2. [Explanation]
   ...
   Final Remark: [Insert brief closing statement here]

📝 Output Format Example:

I. Causes of World War I

Step-by-Step Discussion:
1. The assassination of Archduke Franz Ferdinand acted as a catalyst.
2. Alliances between countries escalated the conflict.
3. Nationalism and militarism fueled tensions across Europe.
4. Imperial rivalries increased competition and hostility.
5. The war officially began in 1914 after a series of political ultimatums.

II. Major Battles

Step-by-Step Discussion:
1. The Battle of the Marne marked a turning point early in the war.
2. Trench warfare led to prolonged stalemates.
3. The Battle of the Somme highlighted the war’s human cost.

Final Remark: This concludes the outline. Understanding these events helps explain the global impact of the war and its lasting consequences.

---
✅ End of Instruction. Please follow the format strictly to ensure clarity and consistency in the output.


Here is the content:
[Insert PDF text here]
TEXT;

   const PROGRESS_INSTRUCTION = <<<TEXT
📄 INSTRUCTION TO LLM: Generate Step-by-Step Discussion from Outline with Progress Awareness

You are given:
- A full list of outline topics (in order)
- A history of previously generated content

Your task is to:
1. Identify which topics from the outline have already been discussed in the past responses.
2. Determine the next topic in the outline that has NOT been discussed yet.
3. Generate a step-by-step explanation ONLY for that next topic.
4. Include a final remark at the end of that topic’s discussion.
5. Do NOT repeat, skip, or summarize past or future topics.

---

🧠 INPUTS:

FULL OUTLINE:
{{OUTLINE}}

PREVIOUSLY GENERATED OUTPUT:
{{PAST_RESPONSES}}

---

🎯 OUTPUT FORMAT:

CURRENT PROGRESS:
You are on topic {{CURRENT_INDEX}} of {{TOTAL_TOPICS}}.

PAST TOPICS COVERED:
1. {{Title A}}
2. {{Title B}}

DO NOT REPEAT these. Only generate the next one below:

NEXT TOPIC TO DISCUSS:
{{Title of Next Topic}}

Step-by-Step Discussion:
1. ...
2. ...
3. ...

---
TEXT;

   const PROMPT_INSTRUCTION = <<<TEXT
🎓 Pretend you are a teacher. Follow this instruction: {{instruction}}
Teach clearly, stay on topic, and be concise. Keep your explanation structured, focused, and brief to maintain student engagement. Do not go beyond the scope.

Address their questions naturally within your teaching. Prioritize clarity, relevance, and brevity in your response to avoid losing attention.

Reply keep it short

Student Prompt:
{{prompt}}
TEXT;

   const POST_INSTRUCTION = <<<TEXT
   📝 INSTRUCTION:  
Format the following content into paragraphs with the following rules:  
- Each paragraph must contain a maximum of 30 words.  
- End each paragraph with a period.  
- Add `<b>` after each paragraph to separate them.  
- Do not break sentences unnaturally.  
- Preserve meaning and logical flow.

📌 FORMAT RULES:  
- Max 30 words per paragraph  
- Natural sentence boundaries only  
- End each with a period  
- Paragraphs separated using `<b>` (line break or spacer)

🔍 EXAMPLE OUTPUT:

The Philippine Revolution began in 1896 as Filipinos fought against Spanish colonial rule. Inspired by nationalist movements, they formed secret groups like the Katipunan.  
<b>  
Leaders such as Andrés Bonifacio and Emilio Aguinaldo played major roles in organizing revolts and leading military actions. This marked a turning point in Philippine resistance.  
<b>  
After years of conflict, the Spanish surrendered in 1898. However, this did not bring true independence, as the United States soon claimed control, leading to a new struggle for sovereignty.  
<b>

---

✏️ TEXT TO FORMAT:  
{input_text}
TEXT;
}
