import json
import re

# Path to your LaTeX file
TEX_FILE = "/workspaces/kono-audio-explorer/latex/01222025 (1).tex"

# Output path for your JSON
OUTPUT_JSON = "data.json"

# Static values you can change or read from metadata later
DEFAULT_CATEGORY = "Basic Vocabulary"
DEFAULT_SUBCATEGORY = "Basics For Politeness"
DEFAULT_AUDIO = "audio/politeness_1.mp3"
DEFAULT_DATE = "01/22/2025"
DEFAULT_OVERLEAF_LINK = "https://www.overleaf.com/project/684c2e9b72471fbdbb550325"

# Regex to match \ex. or \exg. lines followed by English gloss, each ending with '\\'
# Pattern captures content between \ex[ or \exg.] and double backslash, then next line (English) also ending with double backslash
GLOSS_PATTERN = re.compile(
    r'\\exg?\.?\s*(.*?)\\\\\s*(.*?)\\\\', 
    re.DOTALL
)

def extract_glosses(tex_path):
    with open(tex_path, 'r', encoding='utf-8') as f:
        tex_content = f.read()

    matches = GLOSS_PATTERN.findall(tex_content)
    results = []
    for kono_word, english_gloss in matches:
        results.append({
            "category": DEFAULT_CATEGORY,
            "subcategory": DEFAULT_SUBCATEGORY,
            "date": DEFAULT_DATE,
            "audio": DEFAULT_AUDIO,
            "overleaf_link": DEFAULT_OVERLEAF_LINK,
            "kono": kono_word.strip(),
            "english": english_gloss.strip()
        })
    return results

def write_json(data, out_path):
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ Wrote {len(data)} entries to {out_path}")

if __name__ == "__main__":
    gloss_data = extract_glosses(TEX_FILE)
    write_json(gloss_data, OUTPUT_JSON)
