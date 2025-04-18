import os
import sys
from openai import OpenAI

def load_file_content(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def build_user_prompt(code: str) -> str:
    return f"{code}"

def get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    return OpenAI(api_key=api_key)

def run_architecture_check(file_path: str, prompt_path: str) -> None:
    client = get_openai_client()

    file_content = load_file_content(file_path)
    system_prompt = load_file_content(prompt_path)
    user_prompt = build_user_prompt(file_content)

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    print(f"--- Sugestão para: {file_path} ---")
    print(response.choices[0].message.content)

def main():
    file_path = sys.argv[1]
    prompt_path = "ai-agents/architecture-checker/system-prompt.md"
    run_architecture_check(file_path, prompt_path)

if __name__ == "__main__":
    main()
