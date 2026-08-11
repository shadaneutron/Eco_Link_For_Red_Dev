file_path = 'frontend/src/components/logistics/LogisticsDashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Remove the delayed shipments and fleet utilization cards from the dashboard block
pattern_delayed = r'<div className="bg-\[#F7FAF9\] border border-\[#C4C6D0\] rounded-lg p-4 space-y-2 shadow-2xs">\s*<p className="font-mono text-xs text-\[#44474F\] uppercase tracking-wider">\s*DELAYED SHIPMENTS\s*</p>\s*<p className="font-sans text-2xl font-semibold text-\[#BA1A1A\]">\s*\{shipments\.filter[^}]+\}\s*</p>\s*</div>'
pattern_fleet = r'<div className="bg-\[#F7FAF9\] border border-\[#C4C6D0\] rounded-lg p-4 space-y-2 shadow-2xs">\s*<p className="font-mono text-xs text-\[#44474F\] uppercase tracking-wider">\s*FLEET UTILIZATION\s*</p>\s*<p className="font-sans text-2xl font-semibold text-\[#006A6A\]">.*?<\/p>\s*</div>'

content = re.sub(pattern_delayed, '', content, flags=re.DOTALL)
content = re.sub(pattern_fleet, '', content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed fake KPIs successfully.")