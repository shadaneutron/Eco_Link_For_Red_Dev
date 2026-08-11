import re
with open('frontend/src/components/logistics/LogisticsDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">.*?ACTIVE VEHICLES.*?</div>\s*</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL)
content = re.sub(r'<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">.*?AVG RESPONSE TIME.*?</div>\s*</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL)
with open('frontend/src/components/logistics/LogisticsDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
