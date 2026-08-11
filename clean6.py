import re
with open('frontend/src/components/recycler/RecyclerWasteDetail.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'\s*const defaultImages = \[.*?\];\s*', '\n  const defaultImages: string[] = [];\n', content, flags=re.DOTALL)
content = re.sub(r'\{images\[selectedImage\] \? \(.*?\) : \(.*?\)\}', '{images[selectedImage] ? (\n                <img\n                  src={images[selectedImage]}\n                  alt={title}\n                  className="w-full h-full object-cover"\n                />\n              ) : (\n                <div className="flex flex-col items-center"><ImageIcon className="w-12 h-12 opacity-50 mb-4" /><span>No image available</span></div>\n              )}', content, flags=re.DOTALL)
with open('frontend/src/components/recycler/RecyclerWasteDetail.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
