with open('frontend/src/components/factory/UploadWastePage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
del lines[131:135]
with open('frontend/src/components/factory/UploadWastePage.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
