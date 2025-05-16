import os
import sys
import argparse
from typing import List
from openai import OpenAI
import google.generativeai as genai
from google.generativeai import configure, GenerativeModel

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

def generate_text(system_prompt: str, user_prompt: str, provider: str) -> str:
    if provider == "openai":
        api_key = os.getenv("OPENAI_API_KEY")
        openai_client = OpenAI(api_key=api_key)

        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )

        return response.choices[0].message.content

    elif provider == "gemini":
        configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = GenerativeModel("gemini-2.5-flash")

        response = model.generate_content([
            {"role": "system", "parts": [system_prompt]},
            {"role": "user", "parts": [user_prompt]},
        ])

        return response.text

    else:
        raise ValueError(f"Unsupported provider: {provider}")

def extract_architecture_patterns_from_files(file_paths: List[str], provider: str) -> str:
    system_prompt = load_file_content("ai-agents/architecture-checker/system-prompt.md")
    user_prompt = build_user_prompt(file_paths)

    return generate_text(system_prompt, user_prompt, provider)

def main():
    parser = argparse.ArgumentParser(description="Run architecture checker")
    parser.add_argument("--provider", required=True, choices=["openai", "gemini"], help="AI provider to use")
    parser.add_argument("file_paths", nargs="+", help="Paths to files to analyze")

    args = parser.parse_args()

    provider = args.provider
    file_paths = args.file_paths

    print(f"Usando provedor: {provider}")
    print(f"Analisando arquivos: {file_paths}")

    all_extracted_architecture_patterns = []

    for batch_start_index in range(0, len(file_paths), BATCH_FILE_ANALYSIS_SIZE):
        batch_file_path = file_paths[batch_start_index:batch_start_index + BATCH_FILE_ANALYSIS_SIZE]
        extracted_architecture_pattern = extract_architecture_patterns_from_files(batch_file_path, provider)
        all_extracted_architecture_patterns.append(extracted_architecture_pattern)

    print("\n\n---\n\n".join(all_extracted_architecture_patterns))

if __name__ == "__main__":
    main()
