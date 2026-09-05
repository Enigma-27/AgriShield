import React from 'react';
import { FileDown, TrendingUp, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Portfolio = ({ dataHistory = [] }) => {
  const [windowSize, setWindowSize] = React.useState(5);

  // Reverse the history so the newest Google Sheet entries appear at the top
  const sortedHistory = [...dataHistory].reverse();

  // --- 1. SUMMARY CALCULATIONS ---
  const totalPoints = dataHistory.length;
  
  // Sliding Window Payout Logic
  let maxWindowAverage = -1;
  let maxWindowRecords = [];
  if (dataHistory.length > 0) {
    const payouts = dataHistory.map(d => parseFloat(d.payout_pct) || 0);
    // Ensure window size doesn't exceed total data points
    const wSize = Math.max(1, Math.min(windowSize, payouts.length));
    
    for (let i = 0; i <= payouts.length - wSize; i++) {
      let sum = 0;
      for (let j = 0; j < wSize; j++) {
        sum += payouts[i + j];
      }
      const avg = sum / wSize;
      if (avg > maxWindowAverage) {
        maxWindowAverage = avg;
        maxWindowRecords = dataHistory.slice(i, i + wSize);
      }
    }
  }
  if (maxWindowAverage === -1) maxWindowAverage = 0;
  const totalPayouts = maxWindowAverage;
  
  const avgRisk = totalPoints > 0 
    ? (dataHistory.reduce((acc, curr) => acc + (parseFloat(curr.risk_score) || 0), 0) / totalPoints).toFixed(2) 
    : 0;

  // --- 2. DOWNLOAD LOGIC (Client-Side PDF Generation) ---
  const downloadReport = () => {
    if (dataHistory.length === 0) {
      alert("No data available to download.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(22);
    doc.setTextColor(6, 44, 27); // #062c1b
    doc.text("AgriShield Official Parametric Report", pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });

    // Sustained Event Window Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Max Sustained Event (Window Size: ${maxWindowRecords.length})`, 14, 40);
    
    if (maxWindowAverage > 0 && maxWindowRecords.length > 0) {
      // Add the window's max average text right below the title
      doc.setFontSize(10);
      doc.setTextColor(6, 44, 27);
      doc.text(`Total Indemnity: ${maxWindowAverage.toFixed(2)}%`, 14, 46);

      const windowBody = maxWindowRecords.map(log => [
        log.timestamp,
        `${log.payout_pct}%`,
        log.primary_driver,
        `${log.risk_score}%`
      ]);
      
      autoTable(doc, {
        startY: 50,
        head: [['Date', 'Payout Amount', 'Primary Driver', 'Risk Score']],
        body: windowBody,
        theme: 'grid',
        headStyles: { fillColor: [6, 44, 27] }
      });
    } else {
      doc.setFontSize(10);
      doc.text("No payouts triggered in the recorded period.", 14, 48);
    }

    // Full Audit Trail Section
    const nextY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 60;
    doc.setFontSize(14);
    doc.text("Complete Audit Trail", 14, nextY);

    // Headers matching your AgriShield schema
    const headers = [["Timestamp", "Temp(C)", "Moisture(%)", "Humidity(%)", "Rain(mm)", "Driver", "Risk", "Payout"]];
    
    // Map data to rows using new snake_case keys
    const rows = sortedHistory.map(log => [
      log.timestamp,
      log.temperature,
      log.soil_moisture,
      log.humidity,
      log.rainfall,
      log.primary_driver,
      `${log.risk_score}%`,
      `${log.payout_pct}%`
    ]);

    autoTable(doc, {
      startY: nextY + 5,
      head: headers,
      body: rows,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [6, 44, 27] }
    });

    doc.save(`AgriShield_Payout_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic tracking-tighter">Portfolio Audit</h2>
          <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">
            Detailed trail of {totalPoints} parametric triggers via Google Sheets
          </p>
        </div>
        
        <button 
          onClick={downloadReport}
          className="flex items-center gap-2 bg-[#062c1b] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black hover:scale-105 transition-all shadow-xl"
        >
          <FileDown size={20} />
          Export Audit Trail (.PDF)
        </button>
      </header>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-green-100 p-2 rounded-2xl flex items-center justify-center"><img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" /></div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Records Synced</p>
                <p className="text-2xl font-black text-gray-800 tracking-tighter">{totalPoints}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><TrendingUp size={24}/></div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Risk Index</p>
                <p className="text-2xl font-black text-gray-800 tracking-tighter">{avgRisk}%</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-600 mt-1"><AlertCircle size={24}/></div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Indemnity</p>
                  <select 
                    value={windowSize} 
                    onChange={(e) => setWindowSize(Number(e.target.value))}
                    className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 rounded-lg px-2 py-1 outline-none font-bold"
                  >
                    <option value={1}>Peak (1x)</option>
                    <option value={3}>Window: 3</option>
                    <option value={5}>Window: 5</option>
                    <option value={10}>Window: 10</option>
                  </select>
                </div>
                <p className="text-2xl font-black text-gray-800 tracking-tighter">{totalPayouts.toFixed(2)}%</p>
                <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">Max sustained avg</p>
            </div>
        </div>
      </div>

      {/* AUDIT TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                <tr>
                <th className="px-8 py-5">Sync Timestamp</th>
                <th className="px-8 py-5">Parametric Payload</th>
                <th className="px-8 py-5">Primary Trigger</th>
                <th className="px-8 py-5">AI Risk Score</th>
                <th className="px-8 py-5 text-right">Authorized Payout</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {sortedHistory.map((log, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6 text-xs font-bold text-gray-700">{log.timestamp}</td>
                    <td className="px-8 py-6 text-xs text-gray-500 font-bold tracking-tighter">
                    {log.temperature}°C | {log.soil_moisture}% | {log.humidity}% | {log.rainfall}mm
                    </td>
                    <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-gray-600 uppercase italic bg-gray-100 px-3 py-1 rounded-lg">
                            {log.primary_driver}
                        </span>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${log.risk_score > 40 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className={`text-[11px] font-black ${log.risk_score > 40 ? 'text-red-600' : 'text-green-600'}`}>
                                {log.risk_score}%
                            </span>
                        </div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-[#062c1b] text-sm tracking-tighter">
                        {log.payout_pct > 0 ? (
                            <span className="text-green-700 bg-green-50 px-3 py-1 rounded-lg">
                                +{log.payout_pct}%
                            </span>
                        ) : (
                            <span className="text-gray-300">—</span>
                        )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;