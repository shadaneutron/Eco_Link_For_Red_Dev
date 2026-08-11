import re

file_path = 'frontend/src/components/logistics/LogisticsDashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

details_block_start = "{activeTab === 'details' && ("
start_idx = content.find(details_block_start)
if start_idx != -1:
    open_count = 0
    end_idx = start_idx
    for i in range(start_idx, len(content)):
        if content[i] == '(':
            open_count += 1
        elif content[i] == ')':
            open_count -= 1
            if open_count == 0:
                end_idx = i + 1
                break
    
    new_details_block = '''{activeTab === 'details' && (
        <div className="space-y-6">
          <section className="space-y-1 flex items-center gap-4">
            <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-white border border-[#C4C6D0] rounded-lg hover:bg-gray-50 text-[#181C1C]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                Shipment Details
              </h1>
              <p className="font-sans text-base text-[#44474F]">
                Review shipment information before starting the pickup.
              </p>
            </div>
          </section>

          {(!selectedShipmentId || !shipments.find(s => s.id === selectedShipmentId)) ? (
             <div className="bg-white border border-[#C4C6D0] rounded-lg p-8 text-center shadow-2xs">
               <p className="text-[#44474F]">Please select a shipment from the dashboard.</p>
             </div>
          ) : (
            (() => {
              const shipment = shipments.find(s => s.id === selectedShipmentId)!;
              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 columns */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Shipment Information Card */}
                    <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
                      <div className="flex justify-between items-start border-b border-[#C4C6D0] pb-3">
                        <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                          Shipment Information
                        </h3>
                        <span className="px-2.5 py-0.5 bg-[#8CF3F3] text-[#007070] font-sans text-xs font-semibold rounded">
                          {shipment.status}
                        </span>
                      </div>
  
                      <div className="grid grid-cols-2 gap-4 font-sans text-sm">
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                            SHIPMENT ID
                          </p>
                          <p className="font-medium text-[#181C1C]">{shipment.id}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-[#44474F] uppercase tracking-wider">
                            WASTE TYPE
                          </p>
                          <p className="font-medium text-[#181C1C]">{shipment.material}</p>
                        </div>
                      </div>
                    </div>
  
                    {/* Pickup Information Card */}
                    <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
                      <h3 className="font-sans font-semibold text-base text-[#181C1C] border-b border-[#C4C6D0] pb-3">
                        Pickup Information
                      </h3>
  
                      <div className="space-y-4 font-sans text-sm">
                        <div className="flex gap-3">
                          <Building2 className="w-5 h-5 text-[#006A6A] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-[#181C1C]">{shipment.route.split(' → ')[0]}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="space-y-6">
                    <div className="bg-[#F7FAF9] border border-[#C4C6D0] rounded-lg p-6 shadow-2xs">
                       {renderStatusActionButton(shipment)}
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}'''
    content = content[:start_idx] + new_details_block + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Details tab successfully.")