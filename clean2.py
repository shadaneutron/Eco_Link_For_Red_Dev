import re
with open('frontend/src/components/factory/UploadWastePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'\s*const handleAddSampleImage = \(\) => \{.*?\};\s*', '\n', content, flags=re.DOTALL)
content = re.sub(r'\s*\{\/\* Quick Sample Add Action \*\/\}.*?<button[^>]*onClick=\{handleAddSampleImage\}[^>]*>.*?<\/button>', '', content, flags=re.DOTALL)
with open('frontend/src/components/factory/UploadWastePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
