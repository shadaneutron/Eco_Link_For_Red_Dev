import re
with open('frontend/src/components/recycler/RecyclerMarketplaceCatalog.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'src=\{getMediaUrl\(item\.imageUrl\)\}', 'src={item.imageUrl}', content)
with open('frontend/src/components/recycler/RecyclerMarketplaceCatalog.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
