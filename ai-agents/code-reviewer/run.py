import os
import sys
import argparse
import re
from typing import List
from openai import OpenAI

def load_file_content(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    return OpenAI(api_key=api_key)

def extract_diff_project_name(diff_content: str) -> str | None:
    match = re.search(r"examples/([^/\s]+)/", diff_content)
    return match.group(1) if match else None

def review_diff_code_changes(diff_file_path: str) -> str:
    diff_file_content = load_file_content(diff_file_path)

    project_name = extract_diff_project_name(diff_file_content)
    user_prompt = diff_file_content
    system_prompt = load_file_content("ai-agents/code-reviewer/system-prompt.md")

    architecture_description = load_file_content(f"ai-agents/code-architecture-checker/{project_name}-example-output.md")
    system_prompt = system_prompt.replace("{{ARCHITECTURE_DESCRIPTION}}", architecture_description)

    openai_client = get_openai_client()

    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return response.choices[0].message.content

def main():
    parser = argparse.ArgumentParser(description="Run code reviewer")
    parser.add_argument("diff_file_paths", nargs="*", help="Paths to diff files to analyze")

    args = parser.parse_args()

    diff_file_paths = args.diff_file_paths

    if not diff_file_paths:
        print("No changes were found in the '/examples' folder for analysis.")
        return

    all_code_review_comments = []

    for diff_file_path in diff_file_paths:
        code_review_comment = review_diff_code_changes(diff_file_path)
        all_code_review_comments.append(code_review_comment)

    print("\n\n---\n\n".join(all_code_review_comments))

if __name__ == "__main__":
    main()