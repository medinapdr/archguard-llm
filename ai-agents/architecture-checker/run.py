import os
import sys
from typing import List
from openai import OpenAI

BATCH_FILE_ANALYSIS_SIZE = 50

def load_file_content(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def build_user_prompt(files: List[str]) -> str:
    parts = []

    for path in files:
        content = load_file_content(path)
        parts.append(f"Arquivo: {path}\n{content}")

    return "\n\n".join(parts)

def get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    return OpenAI(api_key=api_key)

def run_architecture_checker_batch(file_paths: List[str], prompt_path: str) -> None:
    client = get_openai_client()
    system_prompt = load_file_content(prompt_path)
    user_prompt = build_user_prompt(file_paths)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    print(response.choices[0].message.content)
    print("\n\n")

def main():
    *file_paths, = sys.argv[1:]
    prompt_path = "ai-agents/architecture-checker/system-prompt.md"

    for i in range(0, len(file_paths), BATCH_FILE_ANALYSIS_SIZE):
        batch = file_paths[i:i + BATCH_FILE_ANALYSIS_SIZE]
        run_architecture_checker_batch(batch, prompt_path)

if __name__ == "__main__":
    main()
