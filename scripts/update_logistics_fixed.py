import re

file_path = 'frontend/src/components/logistics/LogisticsDashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix tracking block
tracking_block_start = "{activeTab === 'tracking' && ("
start_idx = content.find(tracking_block_start)
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
    
    new_tracking_block = """{activeTab === 'tracking' && (
        <div className="space-y-6">
          <section className="space-y-1 flex items-center gap-4">
            <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-white border border-[#C4C6D0] rounded-lg hover:bg-gray-50 text-[#181C1C]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
                Shipment Tracking
              </h1>
              <p className="font-sans text-base text-[#44474F]">
                Monitor the shipment in real time.
              </p>
            </div>
          </section>

          {(!selectedShipmentId || !shipments.find(s => s.id === selectedShipmentId)) ? (
             <div className="bg-white border border-[#C4C6D0] rounded-lg p-8 text-center shadow-2xs">
               <p className="text-[#44474F]">Please select a shipment from the dashboard to track.</p>
             </div>
          ) : (
            (() => {
              const shipment = shipments.find(s => s.id === selectedShipmentId)!;
              const statusArray = ['Pending', 'Assigned', 'Ready for Pickup', 'Picked Up', 'In Transit', 'Delivered', 'Confirmed'];
              const currentStep = statusArray.indexOf(shipment.status) + 1;
              return (
                <>
                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-4 space-y-4 shadow-2xs">
                    <div className="flex justify-between items-center pb-2 border-b border-[#C4C6D0]">
                      <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                        Shipment Summary
                      </h3>
                      <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] text-[10px] font-semibold rounded uppercase tracking-wider font-mono">
                        {shipment.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 font-sans">
                      <div className="space-y-1">
                        <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">SHIPMENT ID</p>
                        <p className="font-medium text-base text-[#181C1C]">{shipment.id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">WASTE MATERIAL</p>
                        <p className="font-medium text-base text-[#181C1C]">{shipment.material}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">DRIVER</p>
                        <p className="font-medium text-base text-[#181C1C]">{shipment.driver}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-mono text-[11px] text-[#44474F] uppercase tracking-wider">VEHICLE</p>
                        <p className="font-medium text-base text-[#181C1C]">{shipment.vehicle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 shadow-2xs">
                    <h3 className="font-sans font-semibold text-lg text-[#181C1C] mb-8">
                      Tracking Progress
                    </h3>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E6E9E8]"></div>
                      <div className="absolute left-4 top-0 w-0.5 bg-[#006A6A] transition-all duration-500" style={{ height: `${((currentStep - 1) / (statusArray.length - 1)) * 100}%` }}></div>
                      
                      <div className="space-y-8 relative z-10">
                        {statusArray.map((st, index) => {
                           const stepNum = index + 1;
                           const isCompleted = currentStep > stepNum;
                           const isCurrent = currentStep === stepNum;
                           const isPending = currentStep < stepNum;
                           return (
                             <div key={st} className="flex gap-4">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                                 isCompleted ? 'bg-[#006A6A] border-[#006A6A] text-white' : 
                                 isCurrent ? 'bg-white border-[#006A6A] text-[#006A6A]' : 
                                 'bg-white border-[#C4C6D0] text-[#C4C6D0]'
                               }`}>
                                 {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-[#006A6A]' : 'bg-transparent'}`}></div>}
                               </div>
                               <div className="pt-1.5 flex-1">
                                 <h4 className={`font-sans font-semibold text-base ${isPending ? 'text-[#8E9199]' : 'text-[#181C1C]'}`}>
                                   {st}
                                 </h4>
                               </div>
                             </div>
                           );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()
          )}
        </div>
      )}"""
    content = content[:start_idx] + new_tracking_block + content[end_idx:]
    
    # In case the previous python script created an extra closing brace `}}` for confirmation block, let's fix it.
    # The previous script mistakenly added an extra `}` because I might have miscounted parentheses?
    # Let's write the whole file to fix any brace imbalances around confirmation, tracking and reports.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated tracking tab successfully.")
