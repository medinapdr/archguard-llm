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

def extract_architecture_patterns_from_files(file_paths: List[str]) -> str:
    openai_client = get_openai_client()
    system_prompt = load_file_content("ai-agents/architecture-checker/system-prompt.md")
    user_prompt = build_user_prompt(file_paths)

    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return response.choices[0].message.content

def main():
    *file_paths, = sys.argv[1:]

    all_extracted_architecture_patterns = []

    for batch_start_index in range(0, len(file_paths), BATCH_FILE_ANALYSIS_SIZE):
        batch_file_path = file_paths[batch_start_index:batch_start_index + BATCH_FILE_ANALYSIS_SIZE]
        extracted_architecture_pattern = extract_architecture_patterns_from_files(batch_file_path)
        all_extracted_architecture_patterns.append(extracted_architecture_pattern)

    print("\n\n---\n\n".join(all_extracted_architecture_patterns))

if __name__ == "__main__":
    main()
