import os
import sys
from openai import OpenAI

def load_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    return OpenAI(api_key=api_key)

def review_code_changes(diff_content: str) -> str:
    openai_client = get_openai_client()
    system_prompt = load_file("ai-agents/code-reviewer/system-prompt.md")

    architecture_description = load_file("ai-agents/architecture-checker/js-example-output.md")
    system_prompt = system_prompt.replace("{{ARCHITECTURE_DESCRIPTION}}", architecture_description)

    print(system_prompt)

    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": diff_content}
        ]
    )

    return response.choices[0].message.content

def main():
    diff_path = sys.argv[1]
    diff_content = load_file(diff_path)

    if not diff_content.strip():
        print("Nenhuma diferença detectada no diff.")
        return

    result = review_code_changes(diff_content)
    print(result)

if __name__ == "__main__":
    main()