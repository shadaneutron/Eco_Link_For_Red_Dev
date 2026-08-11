import re
with open('frontend/src/components/recycler/RecyclerMarketplaceCatalog.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'<ImageIcon className="w-12 h-12 opacity-50" \/>', '<div className="flex flex-col items-center"><ImageIcon className="w-8 h-8 opacity-50 mb-2" /><span>No image available</span></div>', content)
with open('frontend/src/components/recycler/RecyclerMarketplaceCatalog.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
