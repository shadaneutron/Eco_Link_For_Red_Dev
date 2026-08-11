import re

file_path = 'frontend/src/components/logistics/LogisticsDashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'LogisticsReportsData' not in content:
    content = content.replace("import { shipmentsApi } from '../../services/api';", "import { shipmentsApi, LogisticsReportsData } from '../../services/api';")

# 2. Add state
state_code = '''  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shipments, setShipments] = useState<ShipmentAssignment[]>([]);
  const [reportsData, setReportsData] = useState<LogisticsReportsData | null>(null);'''
if 'const [reportsData' not in content:
    content = content.replace("  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [shipments, setShipments] = useState<ShipmentAssignment[]>([]);", state_code)

# 3. Add fetchReports to fetchShipments or create a separate one and call in useEffect
fetch_reports_code = '''  const fetchReports = async () => {
    try {
      const data = await shipmentsApi.getLogisticsReports();
      setReportsData(data);
    } catch (err: any) {
      console.error('API error fetching reports:', err);
    }
  };'''

if 'const fetchReports = async' not in content:
    content = content.replace('  const fetchShipments = async', fetch_reports_code + '\n\n  const fetchShipments = async')

if 'fetchReports();' not in content:
    content = content.replace('    fetchShipments();\n  }, []);', '    fetchShipments();\n    fetchReports();\n  }, []);')

# 4. Replace confirmation block
confirmation_block_start = "{activeTab === 'confirmation' && ("
# find the start index of the confirmation block
start_idx = content.find(confirmation_block_start)
if start_idx != -1:
    # We need to find the matching closing parenthesis for this block.
    # Count braces/parentheses.
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
    
    new_confirmation_block = '''{activeTab === 'confirmation' && (
        <div className="space-y-6">
          <section className="space-y-1">
            <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
              Delivery Confirmation
            </h1>
            <p className="font-sans text-base text-[#44474F]">
              Manage shipments that are currently in transit or delivered.
            </p>
          </section>

          <div className="bg-white rounded-xl border border-[#C4C6D0] overflow-hidden">
            {shipments.filter(s => ['In Transit', 'Delivered', 'Confirmed'].includes(s.status)).length === 0 ? (
              <div className="p-8 text-center text-[#44474F]">
                <p>No shipments require delivery confirmation.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-sm">
                  <thead>
                    <tr className="bg-[#F7FAF9] border-b border-[#C4C6D0] text-[#44474F] font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Tracking #</th>
                      <th className="py-3 px-4 font-semibold">Material</th>
                      <th className="py-3 px-4 font-semibold">Route</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.filter(s => ['In Transit', 'Delivered', 'Confirmed'].includes(s.status)).map((item) => (
                      <tr key={item.id} className="border-b border-[#E6E9E8] hover:bg-[#F7FAF9] transition-colors">
                        <td className="py-3 px-4 font-medium text-[#181C1C] whitespace-nowrap">{item.id}</td>
                        <td className="py-3 px-4 text-[#44474F]">{item.material}</td>
                        <td className="py-3 px-4 text-[#44474F]">{item.route}</td>
                        <td className="py-3 px-4 text-right">
                          {renderStatusActionButton(item, true)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}'''
    content = content[:start_idx] + new_confirmation_block + content[end_idx:]

# 5. Replace tracking block
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
    
    new_tracking_block = '''{activeTab === 'tracking' && (
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
                      <div className="absolute left-4 top-0 w-0.5 bg-[#006A6A] transition-all duration-500" style={{ height: ${((currentStep - 1) / (statusArray.length - 1)) * 100}% }}></div>
                      
                      <div className="space-y-8 relative z-10">
                        {statusArray.map((st, index) => {
                           const stepNum = index + 1;
                           const isCompleted = currentStep > stepNum;
                           const isCurrent = currentStep === stepNum;
                           const isPending = currentStep < stepNum;
                           return (
                             <div key={st} className="flex gap-4">
                               <div className={w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors }>
                                 {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className={w-2.5 h-2.5 rounded-full }></div>}
                               </div>
                               <div className="pt-1.5 flex-1">
                                 <h4 className={ont-sans font-semibold text-base }>
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
      )}'''
    content = content[:start_idx] + new_tracking_block + content[end_idx:]

# 6. Add reports block before settings
settings_block_start = "{activeTab === 'settings' && ("
start_idx = content.find(settings_block_start)
if start_idx != -1:
    reports_block = '''{activeTab === 'reports' && (
        <div className="space-y-6">
          <section className="space-y-1">
            <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight">
              Logistics Reports
            </h1>
            <p className="font-sans text-base text-[#44474F]">
              Overview of your operational aggregates based on actual shipment records.
            </p>
          </section>

          {!reportsData ? (
             <div className="bg-white border border-[#C4C6D0] rounded-lg p-8 text-center shadow-2xs">
               <p className="text-[#44474F]">Loading reports data...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs">
                <div className="flex items-center gap-3 mb-2 text-[#44474F]">
                  <Truck className="w-5 h-5 text-[#006A6A]" />
                  <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">Total Assigned</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline font-bold text-3xl text-[#181C1C]">{reportsData.total_assigned_shipments}</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs">
                <div className="flex items-center gap-3 mb-2 text-[#44474F]">
                  <ClipboardList className="w-5 h-5 text-[#006A6A]" />
                  <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">In Transit</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline font-bold text-3xl text-[#181C1C]">{reportsData.in_transit}</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs">
                <div className="flex items-center gap-3 mb-2 text-[#44474F]">
                  <CheckCircle2 className="w-5 h-5 text-[#006A6A]" />
                  <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">Delivered</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline font-bold text-3xl text-[#181C1C]">{reportsData.delivered}</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#C4C6D0] shadow-2xs">
                <div className="flex items-center gap-3 mb-2 text-[#44474F]">
                  <CheckSquare className="w-5 h-5 text-[#006A6A]" />
                  <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">Confirmed Completed</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline font-bold text-3xl text-[#181C1C]">{reportsData.confirmed_completed}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}\n\n          '''
    content = content[:start_idx] + reports_block + content[start_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LogisticsDashboard.tsx successfully.")