import os
import sys
import argparse
from openai import OpenAI

BATCH_DIFF_FILE_ANALYSIS_SIZE = 1

def load_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def build_user_prompt(file_paths: List[str]) -> str:
    parts = []

    for path in file_paths:
        content = load_file_content(path)
        parts.append(content)

    return "\n\n".join(parts)

def get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    return OpenAI(api_key=api_key)

def review_code_changes_from_diff_files(diff_file_paths: List[str]) -> str:
    openai_client = get_openai_client()

    user_prompt = build_user_prompt(diff_file_paths)
    system_prompt = load_file("ai-agents/code-reviewer/system-prompt.md")

    architecture_description = load_file("ai-agents/architecture-checker/js-example-output.md")
    system_prompt = system_prompt.replace("{{ARCHITECTURE_DESCRIPTION}}", architecture_description)

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
    parser.add_argument("diff_file_paths", nargs="+", help="Paths to diff files to analyze")

    args = parser.parse_args()

    diff_file_paths = args.diff_file_paths

    all_code_review_comments = []

    for batch_start_index in range(0, len(diff_file_paths), BATCH_DIFF_FILE_ANALYSIS_SIZE):
        batch_diff_file_path = diff_file_paths[batch_start_index:batch_start_index + BATCH_DIFF_FILE_ANALYSIS_SIZE]
        code_review_comment = review_code_changes(batch_diff_file_path)
        all_code_review_comments.append(code_review_comment)

    print("\n\n---\n\n".join(all_code_review_comments))

if __name__ == "__main__":
    main()