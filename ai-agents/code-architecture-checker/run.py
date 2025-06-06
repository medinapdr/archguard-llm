import os
import sys
import argparse
from typing import List
from openai import OpenAI
from google import genai
from google.genai import types

BATCH_CODE_FILE_ANALYSIS_SIZE = 1000

def load_file_content(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def build_user_prompt(file_paths: List[str]) -> str:
    parts = []

    for path in file_paths:
        content = load_file_content(path)
        parts.append(f"File Path: {path}\n```\n{content}\n```")

    return "\n---\n".join(parts)

def generate_llm_response(system_prompt: str, user_prompt: str, provider: str) -> str:
    if provider == "openai":
        api_key = os.getenv("OPENAI_API_KEY")
        openai_client = OpenAI(api_key=api_key)

        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.0
        )

        return response.choices[0].message.content

    elif provider == "gemini":
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-05-20",
            contents=[system_prompt, user_prompt],
            config=types.GenerateContentConfig(
                temperature=0.0,
                thinking_config=types.ThinkingConfig(thinking_budget=1024)
            ),
        )

        return response.text

    else:
        raise ValueError(f"Unsupported provider: {provider}")

def extract_code_architecture_description(code_file_paths: List[str], provider: str) -> str:
    system_prompt = load_file_content("ai-agents/code-architecture-checker/system-prompt.md")
    user_prompt = build_user_prompt(code_file_paths)

    return generate_llm_response(system_prompt, user_prompt, provider)

def main():
    parser = argparse.ArgumentParser(description="Run code architecture checker")
    parser.add_argument("--provider", required=True, choices=["openai", "gemini"], help="AI provider to use")
    parser.add_argument("code_file_paths", nargs="+", help="Paths to code files to analyze")

    args = parser.parse_args()

    provider = args.provider
    code_file_paths = args.code_file_paths

    all_extracted_code_architecture_descriptions = []

    for batch_start_index in range(0, len(code_file_paths), BATCH_CODE_FILE_ANALYSIS_SIZE):
        batch_file_path = code_file_paths[batch_start_index:batch_start_index + BATCH_CODE_FILE_ANALYSIS_SIZE]
        extracted_code_architecture_pattern = extract_code_architecture_description(batch_file_path, provider)
        all_extracted_code_architecture_descriptions.append(extracted_code_architecture_pattern)

    print("\n\n---\n\n".join(all_extracted_code_architecture_descriptions))

if __name__ == "__main__":
    main()
