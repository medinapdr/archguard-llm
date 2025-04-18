import os
import sys
from openai import OpenAI

def main():
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

    file_path = sys.argv[1]
    system_prompt_path = "ai-agents/architecture-checker/system-prompt.md"

    with open(file_path, "r", encoding="utf-8") as f:
        file_content = f.read()

    with open(system_prompt_path, "r", encoding="utf-8") as f:
        system_prompt = f.read()

    user_prompt = f"Analise o seguinte código e sugira melhorias:\n\n{file_content}"

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    print(f"--- Sugestão para: {file_path} ---")
    print(response.choices[0].message.content)

if __name__ == "__main__":
    main()
