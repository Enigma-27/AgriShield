import React from 'react';
import { History, Clock, AlertCircle } from 'lucide-react';

const Portfolio = ({ dataHistory }) => {
  const sortedHistory = [...dataHistory].reverse();

  return (
    <div className="animate-in fade-in duration-700">
      <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase italic">Portfolio Audit</h2>
      <p className="text-gray-500 mb-8 font-medium">Historical trail of parametric triggers and authorized payouts.</p>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
            <tr>
              <th className="px-8 py-4">Timestamp</th>
              <th className="px-8 py-4">Conditions (T/M/H/R)</th>
              <th className="px-8 py-4">Risk Driver</th>
              <th className="px-8 py-4">Risk Score</th>
              <th className="px-8 py-4 text-right">Payout %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedHistory.map((log, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5 text-xs font-bold text-gray-700">{log.timestamp}</td>
                <td className="px-8 py-5 text-xs text-gray-500 font-bold tracking-tighter">
                  {log.temperature}° / {log.soil_moisture}% / {log.humidity}% / {log.rainfall}mm
                </td>
                <td className="px-8 py-5 text-xs font-black text-gray-600 uppercase italic">{log.primary_driver}</td>
                <td className="px-8 py-5">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${log.risk_score > 40 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {log.risk_score}%
                    </span>
                </td>
                <td className="px-8 py-5 text-right font-black text-[#062c1b] text-sm">
                    {log.payout_pct > 0 ? `${log.payout_pct}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;