"use client";
import * as XLSX from "xlsx";
import { useEffect } from "react";
import { useState} from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  BarChart, Bar,
  ResponsiveContainer
} from "recharts";

import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Layers,
  Wallet,
  BarChart3,
  Percent,
  Activity
} from "lucide-react";


/* ================= DATA ================= */

const products = {
  Basic: { selling: 80000, cogs: 30000, variable: 9000, growth: 12000, fixed: 8000, depreciation: 1500, interest: 1500 },
  Premium: { selling: 100000, cogs: 35000, variable: 11000, growth: 17000, fixed: 10000, depreciation: 2000, interest: 2000 },
  Ultra: { selling: 150000, cogs: 52000, variable: 20000, growth: 26000, fixed: 15000, depreciation: 3000, interest: 2000 }
};

/* ================= VARIABLE COST DATA ================= */

const variableCostMap = {
  Basic: [
    { name: "Shipping", value: 4000 },
    { name: "Installation", value: 1500 },
    { name: "Packaging", value: 8000 },
    { name: "Payment Gateway Fees", value: 2000 },
    { name: "Platform Commission", value: 2500 },
  ],

  Premium: [
    { name: "Shipping", value: 5000 },
    { name: "Installation", value: 2000 },
    { name: "Packaging", value: 10000 },
    { name: "Payment Gateway Fees", value: 2000 },
    { name: "Platform Commission", value: 3000 },
  ],

  Ultra: [
    { name: "Shipping", value: 8000 },
    { name: "Installation", value: 3000 },
    { name: "Packaging", value: 15000 },
    { name: "Payment Gateway Fees", value: 3000 },
    { name: "Platform Commission", value: 4000 },
  ],
};


/* ================= SEMI VARIABLE COST DATA ================= */

const semiVariableCostMap = {
  Basic: [
    { name: "Ads (Meta / Google)", value: 7000 },
    { name: "Sales Team Commission", value: 3000 },
    { name: "Tech Support", value: 1000 },
    { name: "App Maintenance", value: 1000 },
  ],

  Premium: [
    { name: "Ads (Meta / Google)", value: 10000 },
    { name: "Sales Team Commission", value: 5000 },
    { name: "Tech Support", value: 1000 },
    { name: "App Maintenance", value: 1000 },
  ],

  Ultra: [
    { name: "Ads (Meta / Google)", value: 15000 },
    { name: "Sales Team Commission", value: 7000 },
    { name: "Tech Support", value: 2000 },
    { name: "App Maintenance", value: 2000 },
  ],
};


type Product = {
  selling: number;
  cogs: number;
  variable: number;
  growth: number;
  fixed: number;
  depreciation: number;
  interest: number;
};

  function calc(d: any) {
  const gross = d.selling - d.cogs;
  const cm1 = gross - d.variable;
  const cm2 = cm1 - d.growth;
  const ebitda = cm2 - d.fixed;
  const ebit = ebitda - d.depreciation;
  const pbt = ebit - d.interest;
  const pat = pbt * 0.7;
  return { gross, cm1, cm2, ebitda, pbt, pat };
}

/* ================= MAIN ================= */
  function downloadExcel(data: any, filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}


export default function Page() {
    
    const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

    const [sidebarOpen, setSidebarOpen] = useState(false); 

    const cogsData = [
    { category: "Hardware", sub: "Electronics", item: "Motors", type: "Material" },
    { category: "Hardware", sub: "Electronics", item: "ESP32", type: "Material" },
    { category: "Hardware", sub: "Electronics", item: "Motor Drivers", type: "Material" },
    { category: "Hardware", sub: "Electronics", item: "PCB", type: "Material" },
    { category: "Hardware", sub: "Electronics", item: "Power Supply", type: "Material" },

    { category: "Mechanical", sub: "Structure", item: "Metal Frame", type: "Manufacturing" },
    { category: "Mechanical", sub: "Structure", item: "Bearings", type: "Manufacturing" },
    { category: "Mechanical", sub: "Structure", item: "Magnet System", type: "Manufacturing" },

    { category: "Table", sub: "Body", item: "Wood / MDF", type: "Material" },
    { category: "Table", sub: "Finishing", item: "Polish / Laminate", type: "Manufacturing" },

    { category: "Labor", sub: "Assembly", item: "Technician", type: "Labour" },
    { category: "Labor", sub: "Assembly", item: "Carpenter", type: "Labour" },

    { category: "Packaging", sub: "Packing", item: "Box", type: "Manufacturing" },
    { category: "Packaging", sub: "Packing", item: "Foam", type: "Manufacturing" },
    ];

    const [selected, setSelected] = useState<"Basic" | "Premium" | "Ultra">("Premium");

    const d = products[selected];
    const variableCostData = variableCostMap[selected];
    const semiVariableCostData = semiVariableCostMap[selected];
    const c = calc(d);

    const percent = (value: number) => ((value / d.selling) * 100).toFixed(1);
    const lineData = [
        { name: "Selling", value: d.selling },
        { name: "Gross", value: c.gross },
        { name: "CM1", value: c.cm1 },
        { name: "CM2", value: c.cm2 },
        { name: "EBITDA", value: c.ebitda },
        { name: "PAT", value: c.pat },
    ];

  const costData = [
    { name: "COGS", value: d.cogs },
    { name: "Variable", value: d.variable },
    { name: "Growth", value: d.growth },
    { name: "Fixed", value: d.fixed },
  ];
 const [active, setActive] = useState("Overview");




  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f6f8fb] font-sans">

 {/* SIDEBAR */}
 

 <div
  className={`fixed md:static top-0 left-0 z-50
  h-screen w-64
  bg-red-100 border-r
  px-6 py-6
  flex flex-col
  justify-between
  overflow-y-auto
  transform transition-transform duration-300
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
`}
>
  <div>

    {/* LOGO / TITLE */}
   <div className="flex flex-col items-center justify-center text-center py-6">
  <img
    src="/image.png"
    className="w-35 h-35 rounded-lg  p-1 shadow"
  />

  <div className="mt-3">
    <h2 className="text-[25px] font-semibold text-red-900 tracking-tight">
      Tarang
    </h2>
    <p className="text-xs text-red-700 mt-1">
      Analytics Dashboard
    </p>
  </div>
</div>

    {/* NAVIGATION */}
    <div className="space-y-2">

      {/* OVERVIEW */}
      <div
        onClick={() => {
  setActive("Overview");
  setSidebarOpen(false);
}}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
        ${active === "Overview"
          ? "bg-red-300 text-red-900"
          : "text-red-800 hover:bg-red-200"}`}
      >
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        Overview
      </div>

      {/* UNIT ECONOMICS */}
      <div
        onClick={() => {
  setActive("Unit Economics");
  setSidebarOpen(false);
}}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
        ${active === "Unit Economics"
          ? "bg-red-300 text-red-900"
          : "text-red-800 hover:bg-red-200"}`}
      >
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        Unit Economics
      </div>

      

      {/* CM1 */}
      <div
        onClick={() => {
  setActive("CM1");
  setSidebarOpen(false);
}}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
        ${active === "CM1"
          ? "bg-red-300 text-red-900"
          : "text-red-800 hover:bg-red-200"}`}
      >
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        CM1
      </div>

      {/* CM2 */}
      <div
        onClick={() => {
  setActive("CM2");
  setSidebarOpen(false);
}}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
        ${active === "CM2"
          ? "bg-red-300 text-red-900"
          : "text-red-800 hover:bg-red-200"}`}
      >
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        CM2
      </div>
      {/* COGS BREAKDOWN */}
        <div
       onClick={() => {
  setActive("COGS");
  setSidebarOpen(false);
}}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
        ${active === "COGS"
        ? "bg-red-300 text-red-900"
        : "text-red-800 hover:bg-red-200"}`}
        >
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        COGS Breakdown
        </div>
      

    </div>

  </div>

  {/* BOTTOM SECTION */}
  <div className="mt-auto">

    <div className="bg-red-50 border border-red-200 rounded-lg p-2 md:p-3 text-base md:text-lg md:text-lg text-red-800">
      <p className="font-semibold mb-1">Dashboard Insight</p>
      <p className="text-[11px] text-red-700">
        Monitor cost efficiency and profit flow across product tiers.
      </p>
    </div>

    <p className="text-[11px] text-red-600 mt-4 text-center">
      © 2026 Tarang Analytics
    </p>

  </div>

</div>

      {/* MAIN */}
<div className="flex-1 flex flex-col overflow-hidden w-full">

  {/* TOP BAR */}
  <div className="w-full px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-100 border-b border-green-200 shadow-sm">

    {/* ☰ MENU BUTTON */}
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="md:hidden bg-red-100 p-2 rounded-lg"
    >
      ☰
    </button>

    {/* LEFT TITLE */}
    <div className="flex items-center gap-3 w-full md:w-auto">
      <div>
        <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-semibold text-red-900">
          Tarang Profit Engine Dashboard
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-green-700">
          Financial Performance Overview
        </p>
      </div>
    </div>

    {/* RIGHT CONTROLS */}
    <div className="w-full md:w-auto md:ml-auto">

      <div className="flex flex-wrap gap-2 w-full md:w-auto">

        {["Basic", "Premium", "Ultra"].map((item) => (
          <button
            key={item}
            onClick={() => setSelected(item as "Basic" | "Premium" | "Ultra")}
            className={`flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all duration-200
              ${
                selected === item
                  ? "bg-green-600 text-white border-green-600 shadow"
                  : "bg-white text-green-900 border-green-300 hover:bg-green-100"
              }
            `}
          >
            {item === "Ultra" ? "Ultra Premium" : item}
          </button>
        ))}

      </div>

    </div>

  </div>

        {/* CONTENT */}
 <div className="flex-1 p-4 md:p-8 space-y-4 md:space-y-6 overflow-y-auto overflow-x-hidden min-h-0">
        {/* KPI ROW */}
        {/* KPI ROW */}
  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 w-full">

  <KPI title="Selling Price" value={d.selling} icon={<IndianRupee />} percent="100%" />

  <KPI title="COGS" value={d.cogs} icon={<TrendingDown />} red percent={`${percent(d.cogs)}%`} />

  <KPI title="Gross" value={c.gross} icon={<TrendingUp />} green percent={`${percent(c.gross)}%`} />

  <KPI title="CM1 (Variable Cost)" value={c.cm1} icon={<Percent />} percent={`${percent(c.cm1)}%`} />

  <KPI title="CM2 (Fixed Cost)" value={c.cm2} icon={<Activity />} percent={`${percent(c.cm2)}%`} />

  <KPI title="EBITDA" value={c.ebitda} icon={<Wallet />} green percent={`${percent(c.ebitda)}%`} />

  <KPI title="PBT" value={c.pbt} icon={<BarChart3 />} percent={`${percent(c.pbt)}%`} />

  <KPI title="PAT" value={c.pat} icon={<TrendingUp />} green percent={`${percent(c.pat)}%`} />

</div>
          
        {/* ================= DYNAMIC CONTENT ================= */}

{/* ================= OVERVIEW ================= */}
{active === "Overview" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* 🔹 LINE CHART */}
    <ChartCard title="Profit Flow Analysis">
        {mounted && (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#000", fontSize: 11 }}
            axisLine={{ stroke: "#000" }}
            tickLine={{ stroke: "#000" }}
          />
          <YAxis
            tick={{ fill: "#000", fontSize: 11 }}
            axisLine={{ stroke: "#000" }}
            tickLine={{ stroke: "#000" }}
          />
          <Tooltip
            contentStyle={{ color: "#000" }}
            labelStyle={{ color: "#000" }}
          />
          <Line type="monotone" dataKey="value" stroke="#16a34a" />

        </LineChart>
      </ResponsiveContainer>
      )}
    </ChartCard>

    {/* 🔹 PIE / DONUT */}
    <ChartCard title="Cost Structure Breakdown">
      <CostBreakdownChart data={costData} />
    </ChartCard>

    {/* 🔹 COST COMPARISON BAR */}
    <ChartCard title="Cost Comparison">
     <ResponsiveContainer width="100%" height="100%">
        <BarChart data={costData}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#000", fontSize: 11 }}
            axisLine={{ stroke: "#000" }}
            tickLine={{ stroke: "#000" }}
          />
          <YAxis
            tick={{ fill: "#000", fontSize: 11 }}
            axisLine={{ stroke: "#000" }}
            tickLine={{ stroke: "#000" }}
          />
          <Tooltip
            contentStyle={{ color: "#000" }}
            labelStyle={{ color: "#000" }}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>

    {/* 🔹 PROFIT STAGE DISTRIBUTION */}
    <ChartCard title="Profit Stage Distribution">
        <ResponsiveContainer width="100%" height="100%">
      
        <BarChart data={lineData}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#000", fontSize: 11 }}
            axisLine={{ stroke: "#000" }}
            tickLine={{ stroke: "#000" }}
          />
          <YAxis
            tick={{ fill: "#000", fontSize: 11 }}
            axisLine={{ stroke: "#000" }}
            tickLine={{ stroke: "#000" }}
          />
          <Tooltip
            contentStyle={{ color: "#000" }}
            labelStyle={{ color: "#000" }}
          />
          <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>

  </div>
)}

{/* ================= VARIABLE COST ================= */}
{active === "Variable Cost" && (
  <div className="space-y-6">

    {/* ===== HERO ===== */}
    <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-6 rounded-xl border shadow flex flex-col md:flex-row justify-between items-center gap-4">

      <div>
        <h2 className="text-lg font-semibold text-orange-900">
          Variable Cost Analysis
        </h2>
        <p className="text-sm text-gray-600">
          Direct & Semi-variable cost breakdown
        </p>
      </div>

      <div className="text-center md:text-right">
        <p className="text-3xl font-bold text-orange-600">
          ₹{d.variable.toLocaleString("en-IN")}
        </p>
        <p className="text-sm font-semibold text-orange-600">
          {percent(d.variable)}% of Selling Price
        </p>
      </div>

    </div>

    {/* ===== TWO CHARTS ===== */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* 🔹 VARIABLE COST */}
      <ChartCard title="Direct Variable Costs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { name: "Shipping", value: 5000 },
            { name: "Installation", value: 2000 },
            { name: "Packaging", value: 10000 },
            { name: "Gateway Fees", value: 3000 },
            { name: "Commission", value: 3000 },
          ]}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#000" }} />
        <YAxis tick={{ fill: "#000" }} />
        <Tooltip />
        <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 🔹 SEMI VARIABLE */}
      <ChartCard title="Semi Variable Costs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { name: "Ads", value: 10000 },
            { name: "Sales Team", value: 5000 },
            { name: "Tech Support", value: 1000 },
            { name: "App Maintain", value: 1000 },
          ]}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#fb3cb5" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>

    {/* ===== INSIGHT SECTION ===== */}
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800 space-y-1">
      <p>
        🔎 Direct variable costs impact per unit production efficiency.
      </p>
      <p>
        📊 Semi-variable costs increase with scale (marketing & sales).
      </p>
      <p className="font-semibold">
        👉 Packaging + Ads are major contributors — optimize here first.
      </p>
    </div>

  </div>
)}
{/* ================= CM1 ================= */}

  {active === "CM1" && (
  <div className="space-y-6">

    {/* 🔶 HEADER */}
    <div className="bg-orange-100 p-6 rounded-xl border border-orange-300 flex flex-col md:flex-row justify-between items-center gap-4">

      <div>
        <h2 className="text-xl font-bold text-black">
          Variable Cost Engine
        </h2>
        <p className="text-sm text-black">
          Detailed cost breakdown for {selected}
        </p>
      </div>

      <div className="text-right">
        <p className="text-3xl font-bold text-black">
          ₹{d.variable.toLocaleString("en-IN")}
        </p>
        <p className="text-sm font-semibold text-black">
          {percent(d.variable)}% of Selling Price
        </p>
      </div>

    </div>

    {/* 📊 CHARTS */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* DIRECT */}
      <ChartCard title="Direct Variable Costs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={variableCostData}>
            <XAxis dataKey="name" tick={{ fill: "#000", fontSize: 12 }} />
            <YAxis tick={{ fill: "#000" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #000" }}
              labelStyle={{ color: "#000", fontWeight: "bold" }}
              formatter={(v) => [`₹${v}`, "Cost"]}
            />
            <Bar dataKey="value" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* SEMI */}
      <ChartCard title="Semi Variable Costs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={semiVariableCostData}>
            <XAxis dataKey="name" tick={{ fill: "#000", fontSize: 12 }} />
            <YAxis tick={{ fill: "#000" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #000" }}
              labelStyle={{ color: "#000", fontWeight: "bold" }}
              formatter={(v) => [`₹${v}`, "Cost"]}
            />
            <Bar dataKey="value" fill="#ec4899" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>

    {/* 📋 TABLES */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* 🔹 DIRECT TABLE */}
      <div className="bg-white p-5 rounded-xl border border-gray-400 shadow">

        <div className="flex justify-between items-center mb-3">
          <h3 className="text-black font-bold">
            Direct Variable Costs
          </h3>

          <button
            onClick={() => downloadExcel(variableCostData, `${selected}_direct_costs`)}
            className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded-lg text-sm"
          >
            Download Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-black">

            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="px-3 py-2 border">Component</th>
                <th className="px-3 py-2 border text-right">Cost (₹)</th>
                <th className="px-3 py-2 border text-right">% of Variable</th>
                <th className="px-3 py-2 border text-center">Type</th>
              </tr>
            </thead>

            <tbody>
              {variableCostData.map((item, i) => {
                const percentShare = ((item.value / d.variable) * 100).toFixed(1);

                return (
                  <tr key={i} className="border hover:bg-gray-100">
                    <td className="px-3 py-2 text-black font-medium border">
                      {item.name}
                    </td>
                    <td className="px-3 py-2 text-right text-black font-semibold border">
                      ₹{item.value.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 text-right text-black border">
                      {percentShare}%
                    </td>
                    <td className="px-3 py-2 text-center text-black border">
                      Direct
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

      {/* 🔹 SEMI TABLE */}
      <div className="bg-white p-5 rounded-xl border border-gray-400 shadow">

        <div className="flex justify-between items-center mb-3">
          <h3 className="text-black font-bold">
            Semi Variable Costs
          </h3>

          <button
            onClick={() => downloadExcel(semiVariableCostData, `${selected}_semi_costs`)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-lg text-sm"
          >
            Download Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-black">

            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="px-3 py-2 border">Component</th>
                <th className="px-3 py-2 border text-right">Cost (₹)</th>
                <th className="px-3 py-2 border text-right">% of Variable</th>
                <th className="px-3 py-2 border text-center">Type</th>
              </tr>
            </thead>

            <tbody>
              {semiVariableCostData.map((item, i) => {
                const percentShare = ((item.value / d.variable) * 100).toFixed(1);

                return (
                  <tr key={i} className="border hover:bg-gray-100">
                    <td className="px-3 py-2 text-black font-medium border">
                      {item.name}
                    </td>
                    <td className="px-3 py-2 text-right text-black font-semibold border">
                      ₹{item.value.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 text-right text-black border">
                      {percentShare}%
                    </td>
                    <td className="px-3 py-2 text-center text-black border">
                      Semi
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

    </div>

    {/* 💡 INSIGHTS */}
    <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-xl text-black text-sm font-medium">
      <p>📦 Packaging = highest cost driver</p>
      <p>📢 Ads = highest semi-variable cost</p>
      <p className="font-bold">
        👉 Focus here to improve profitability
      </p>
    </div>

  </div>
)}
{/* ================= CM2 ================= */}
{active === "CM2" && (
  <div className="space-y-6">

    {/* 🔷 HEADER */}
    <div className="bg-blue-100 border border-black p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">

      <div>
        <h2 className="text-xl font-bold text-black">
          CM2 Profitability Analysis
        </h2>
        <p className="text-sm font-medium text-black">
          Profit after Growth & Fixed Costs ({selected})
        </p>
      </div>

      <div className="text-right">
        <p className="text-3xl font-bold text-black">
          ₹{c.cm2.toLocaleString("en-IN")}
        </p>
        <p className="text-sm font-semibold text-black">
          {percent(c.cm2)}% of Selling Price
        </p>
      </div>

    </div>

    {/* 📊 CHART */}
    <div className="bg-white p-5 rounded-xl border border-black shadow-sm">

      <h3 className="text-black font-bold mb-3">
        CM1 → CM2 Profit Bridge
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={[
            { name: "CM1", value: c.cm1 },
            { name: "Growth Cost", value: -d.growth },
            { name: "Fixed Cost", value: -d.fixed },
            { name: "CM2", value: c.cm2 },
          ]}
        >
          <XAxis dataKey="name" tick={{ fill: "#000", fontWeight: 600 }} />
          <YAxis tick={{ fill: "#000", fontWeight: 600 }} />

          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #000",
              color: "#000",
            }}
            labelStyle={{ color: "#000", fontWeight: "bold" }}
            itemStyle={{ color: "#000" }}
            formatter={(v) => [`₹${v}`, "Value"]}
          />

          <Bar dataKey="value" fill="#2563eb" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>

    </div>

    {/* 📋 TABLE */}
    <div className="bg-white p-5 rounded-xl border border-black shadow-sm">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-black font-bold">
          CM2 Cost Breakdown
        </h3>

        <button
          onClick={() =>
            downloadExcel(
              [
                { Stage: "CM1", Amount: c.cm1, Type: "Revenue" },
                { Stage: "Growth Cost", Amount: d.growth, Type: "Cost" },
                { Stage: "Fixed Cost", Amount: d.fixed, Type: "Cost" },
                { Stage: "CM2", Amount: c.cm2, Type: "Profit" },
              ],
              `${selected}_cm2_analysis`
            )
          }
          className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-sm"
        >
          Download Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-black">

          <thead className="bg-gray-200 text-black font-bold">
            <tr>
              <th className="px-3 py-2 border text-left">Stage</th>
              <th className="px-3 py-2 border text-right">Amount (₹)</th>
              <th className="px-3 py-2 border text-right">% of Revenue</th>
              <th className="px-3 py-2 border text-center">Category</th>
            </tr>
          </thead>

          <tbody>
            {[
              { name: "CM1", value: c.cm1, type: "Revenue" },
              { name: "Growth Cost", value: d.growth, type: "Cost" },
              { name: "Fixed Cost", value: d.fixed, type: "Cost" },
              { name: "CM2", value: c.cm2, type: "Profit" },
            ].map((item, i) => {
              const percentShare = ((item.value / d.selling) * 100).toFixed(1);

              return (
                <tr key={i} className="border hover:bg-gray-100">

                  <td className="px-3 py-2 text-black font-semibold border">
                    {item.name}
                  </td>

                  <td className="px-3 py-2 text-right text-black font-bold border">
                    ₹{item.value.toLocaleString("en-IN")}
                  </td>

                  <td className="px-3 py-2 text-right text-black border">
                    {percentShare}%
                  </td>

                  <td className="px-3 py-2 text-center text-black font-semibold border">
                    {item.type}
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>

    {/* 💡 INSIGHTS */}
    <div className="bg-blue-50 border border-black p-4 rounded-xl text-black text-sm space-y-2 font-medium">

      <p>📉 Growth and Fixed costs reduce CM1 significantly</p>

      <p>
        📊 Growth Cost impact: {percent(d.growth)}% of revenue
      </p>

      <p className="font-bold">
        👉 CM2 represents true operational profitability
      </p>

    </div>

  </div>
)}
{/* ================= COGS ================= */}
{active === "COGS" && (
  <div className="space-y-6">

    {/* 🔷 HEADER */}
    <div className="bg-green-100 border border-black p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">

      <div>
        <h2 className="text-xl font-bold text-black">
          COGS Breakdown Analysis
        </h2>
        <p className="text-sm font-medium text-black">
          Detailed cost of goods sold (materials, manufacturing, labour)
        </p>
      </div>

      <button
        onClick={() => {
          const rows = [
            ["Category", "Subcategory", "Component", "Type"],
            ...cogsData.map((d) => [d.category, d.sub, d.item, d.type]),
          ];

          const csv =
            "data:text/csv;charset=utf-8," +
            rows.map((e) => e.join(",")).join("\n");

          const link = document.createElement("a");
          link.href = encodeURI(csv);
          link.download = "cogs_breakdown.csv";
          link.click();
        }}
        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm"
      >
        Download Excel
      </button>

    </div>

    {/* 📋 TABLE */}
    <div className="bg-white p-5 rounded-xl border border-black shadow-sm">

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-black">

          <thead className="bg-gray-200 text-black font-bold">
            <tr>
              <th className="px-3 py-2 border text-left">Category</th>
              <th className="px-3 py-2 border text-left">Subcategory</th>
              <th className="px-3 py-2 border text-left">Component</th>
              <th className="px-3 py-2 border text-center">Type</th>
            </tr>
          </thead>

          <tbody>
            {cogsData.map((row, i) => (
              <tr key={i} className="border hover:bg-gray-100">

                <td className="px-3 py-2 text-black font-semibold border">
                  {row.category}
                </td>

                <td className="px-3 py-2 text-black border">
                  {row.sub}
                </td>

                <td className="px-3 py-2 text-black border">
                  {row.item}
                </td>

                <td className="px-3 py-2 text-center text-black font-medium border">
                  {row.type}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>

    {/* 💡 INSIGHTS */}
    <div className="bg-green-50 border border-black p-4 rounded-xl text-black text-sm space-y-2 font-medium">

      <p>📦 Hardware & Electronics form the core material cost</p>

      <p>🏗 Mechanical structure contributes significantly to manufacturing cost</p>

      <p>👷 Labour (Technician + Carpenter) impacts assembly efficiency</p>

      <p className="font-bold">
        👉 Optimizing materials sourcing + manufacturing can reduce COGS significantly
      </p>

    </div>

  </div>
)}

{/* ================= UNIT ECONOMICS ================= */}
{active === "Unit Economics" && (
  <div className="bg-white p-6 rounded-xl text-gray-500 text-center shadow">
    Unit Economics Coming Soon...
  </div>
)}

        </div>
      </div>
    </div>
  );
}

/* ================= KPI ================= */

function KPI({ title, value, icon, red, green, percent }) {
  return (
    <div className={`min-w-[160px] sm:min-w-[180px] bg-white px-4 py-4 rounded-xl border shadow-sm flex items-center gap-3 border-t-4 ${
  red
    ? "border-t-red-500"
    : green
    ? "border-t-green-500"
    : "border-t-blue-500"
}`}>
      {/* ICON */}
      <div
        className={`p-3 rounded-lg text-lg ${
          red
            ? "bg-red-100 text-red-600"
            : green
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {icon}
      </div>

      {/* TEXT */}
      <div>
        <p className="text-[11px] text-gray-500 font-medium truncate max-w-[120px]">{title}</p>
<h2 className={`text-sm md:text-lg font-semibold ${
  red
    ? "text-red-600"
    : green
    ? "text-green-600"
    : "text-gray-900"
}`}>
  ₹{value.toLocaleString("en-IN")}
</h2>

        {/* ✅ PERCENT */}
        <p className={`text-[11px] mt-1 font-medium opacity-80 ${
  red
    ? "text-red-500"
    : green
    ? "text-green-500"
    : "text-blue-500"
}`}>
  {percent}
</p>
      </div>
    </div>
  );
}

/* ================= CHART CARD ================= */

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">

      <h2 className="text-sm font-semibold text-gray-800 mb-3">
        {title}
      </h2>

      {/* 👇 IMPORTANT FIX */}
      <div className="w-full h-[220px] sm:h-[260px]">
        {children}
      </div>

    </div>
  );
}
/* ================= PIE ================= */

function CostBreakdownChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const COLORS = ["#ef4444", "#f97316", "#3b82f6", "#22c55e"];

  return (
     <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
      {/* PIE */}
      <div className="flex justify-center items-center w-full md:w-1/2">
        <div className="w-full h-[220px] sm:h-[260px]">

            <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Tooltip
                formatter={(value) => {
                  const percent = ((value / total) * 100).toFixed(1);
                  return [`₹${value.toLocaleString("en-IN")} (${percent}%)`, ""];
                }}
              />

              <Pie
                data={data}
                dataKey="value"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              {/* CENTER TEXT */}
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                className="fill-gray-500 text-[10px] sm:text-xs"
              >
                Total
              </text>

              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                className="fill-gray-900 font-semibold w-full sm:w-auto md:text-base"
              >
                ₹{total.toLocaleString("en-IN")}
              </text>

            </PieChart>
          </ResponsiveContainer>

        </div>
      </div>

      {/* LEGENDS */}
      <div className="w-full md:w-1/2 px-2 space-y-2 sm:space-y-3">

        {data.map((d, i) => {
          const percent = ((d.value / total) * 100).toFixed(1);

          return (
            <div
              key={i}
              className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {d.name}
                </span>
              </div>

              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {percent}%
              </span>
            </div>
          );
        })}

      </div>

    </div>
  );
}
          

function COGSTable({ data }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
      
      {/* TITLE */}
      <h2 className="text-lg font-semibold mb-4 text-gray-900">
        COGS Breakdown
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 rounded-lg overflow-hidden">

          {/* HEADER */}
          <thead className="bg-gray-200 text-xs uppercase text-gray-900">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-left font-semibold">Subcategory</th>
              <th className="px-4 py-3 text-left font-semibold">Component</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="border-t border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="px-4 py-2 font-semibold text-gray-900">
                  {row.category}
                </td>

                <td className="px-4 py-2 text-gray-700">
                  {row.sub}
                </td>

                <td className="px-4 py-2 text-gray-700">
                  {row.item}
                </td>

                <td className="px-4 py-2 text-blue-600 text-xs font-semibold">
                  {row.type}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* NOTE */}
      <div className="mt-4 text-xs bg-yellow-100 text-yellow-900 p-3 rounded border border-yellow-300">
        Note: Marketing, rent, salaries, and app development are NOT part of COGS.
      </div>

    </div>
  );
}