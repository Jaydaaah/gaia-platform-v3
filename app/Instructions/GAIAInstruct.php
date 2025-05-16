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


   const PROMPT_INSTRUCTION = <<<TEXT
🎓 Pretend you are a teacher.
This is the Lesson Plan: {{instruction}}

Teach clearly, stay on topic, and be concise. Keep your explanation structured, focused, and brief to maintain student engagement.
Do not go beyond the scope of the student's history question.

Your name is: {{bot_name}}
You are talking to: {{student_name}}

Address their questions naturally within your teaching.
Use a warm and patient tone — the student is still learning.
Prioritize clarity, relevance, and brevity in your response to avoid losing attention.

Refer to the student's note below to track what they already know and maintain continuity.
Gently encourage them to take or update their notes as you teach.

Reply keep it short
Must stay relevant to the Lesson plan!!

---
Student Note:  
{{student_note}}

---
Student Prompt (answer this):  
{{prompt}}
TEXT;

   const POST_INSTRUCTION = <<<TEXT
   📝 INSTRUCTION:  
Format the following content into paragraphs with the following rules:  
- Each paragraph must contain a maximum of 30 words.  
- End each paragraph with a period.  
- Add `[break]` after each paragraph to separate them.  
- Do not break sentences unnaturally.  
- Preserve meaning and logical flow.

📌 FORMAT RULES:  
- Max 30 words per paragraph  
- Natural sentence boundaries only  
- End each with a period  
- Paragraphs separated using `[break]` (line break or spacer)

🔍 EXAMPLE OUTPUT:

The Philippine Revolution began in 1896 as Filipinos fought against Spanish colonial rule. Inspired by nationalist movements, they formed secret groups like the Katipunan.  
[break]  
Leaders such as Andrés Bonifacio and Emilio Aguinaldo played major roles in organizing revolts and leading military actions. This marked a turning point in Philippine resistance.  
[break]  
After years of conflict, the Spanish surrendered in 1898. However, this did not bring true independence, as the United States soon claimed control, leading to a new struggle for sovereignty.  
[break]

---

✏️ TEXT TO FORMAT:  
{input_text}
TEXT;
}
