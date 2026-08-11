import re
with open('backend/core/serializers.py', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'factory_name = serializers\.ReadOnlyField\(source=''factory\.company_name''\)', 'factory_name = serializers.SerializerMethodField()', content)
content = re.sub(r'class WasteListingSerializer\(serializers\.ModelSerializer\):', 'class WasteListingSerializer(serializers.ModelSerializer):\n    def get_factory_name(self, obj):\n        return "Verified Industrial Generator"', content)
content = re.sub(r'recycler_name = serializers\.ReadOnlyField\(source=''recycler\.full_name''\)', 'recycler_name = serializers.SerializerMethodField()', content)
content = re.sub(r'company_name = serializers\.ReadOnlyField\(source=''recycler\.company_name''\)', 'company_name = serializers.SerializerMethodField()', content)
content = re.sub(r'phone = serializers\.ReadOnlyField\(source=''recycler\.phone''\)', 'phone = serializers.SerializerMethodField()', content)
content = re.sub(r'class FactoryBidSerializer\(serializers\.ModelSerializer\):', 'class FactoryBidSerializer(serializers.ModelSerializer):\n    def get_recycler_name(self, obj):\n        return "Verified Recycler"\n\n    def get_company_name(self, obj):\n        return "Verified Recycler"\n\n    def get_phone(self, obj):\n        return "Hidden until accepted"', content)
with open('backend/core/serializers.py', 'w', encoding='utf-8') as f:
    f.write(content)
