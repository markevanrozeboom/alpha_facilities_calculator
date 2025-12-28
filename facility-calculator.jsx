import React, { useState, useMemo } from 'react';

const AlphaFacilityCalculator = () => {
  const [students, setStudents] = useState(150);
  const [leaseAllocation, setLeaseAllocation] = useState(70);
  
  // Constants
  const LEAD_GUIDE_SALARY = 200000;
  const GUIDE_SALARY = 150000;
  const HEAD_OF_SCHOOL_SALARY = 300000;
  const ADMIN_SALARY = 60000;
  const MISC_EXPENSE = 1500;
  const TIMEBACK_SOFTWARE = 5000;
  
  const tuitionLevels = [40000, 50000, 65000];
  
  // Calculate staffing based on student count
  const calculateLeadGuides = (s) => {
    if (s <= 25) return 1;
    if (s <= 125) return 2;
    if (s <= 149) return 3;
    return 4;
  };
  
  const calculateGuides = (s, leadGuides) => {
    const totalGuidesNeeded = Math.round(s / 11);
    return Math.max(0, totalGuidesNeeded - leadGuides);
  };
  
  const calculateHeadOfSchool = (s) => (s <= 50 ? 0 : 1);
  
  const calculatePrograms = (s) => (s <= 30 ? 12000 : 8500);
  
  const getLeaseTermYears = (s) => {
    if (s < 100) return 2;
    if (s <= 250) return 5;
    return 10;
  };
  
  // Target margin based on student count
  const getTargetMargin = (s) => {
    if (s < 30) return 0;      // Breakeven
    if (s <= 100) return 0.15; // 15%
    return 0.25;               // 25%
  };
  
  // Calculate all values for a given tuition
  const calculateModel = (tuition) => {
    const leadGuides = calculateLeadGuides(students);
    const guides = calculateGuides(students, leadGuides);
    const headOfSchool = calculateHeadOfSchool(students);
    const admin = 1;
    
    const guidesExpense = (leadGuides * LEAD_GUIDE_SALARY) + (guides * GUIDE_SALARY);
    const otherHCExpense = (headOfSchool * HEAD_OF_SCHOOL_SALARY) + (admin * ADMIN_SALARY);
    const totalHeadcount = guidesExpense + otherHCExpense;
    
    const programs = calculatePrograms(students) * students;
    const misc = MISC_EXPENSE * students;
    const software = TIMEBACK_SOFTWARE * students;
    
    const revenue = tuition * students;
    const operatingExpenses = totalHeadcount + programs + misc + software;
    
    // Calculate target profit and available for facilities
    const targetMargin = getTargetMargin(students);
    const targetProfit = revenue * targetMargin;
    const grossAvailable = revenue - operatingExpenses;
    const availableForFacilities = revenue - operatingExpenses - targetProfit;
    
    const leaseTermYears = getLeaseTermYears(students);
    
    // Split available budget between lease/other facilities and capex
    // Lease + Other Facilities = Available × Lease Allocation %
    // Since Other Facilities = Lease, each gets half of that allocation
    const leaseAndOtherTotal = availableForFacilities * (leaseAllocation / 100);
    const annualLeaseAmount = leaseAndOtherTotal / 2;
    const annualOtherFacilities = leaseAndOtherTotal / 2; // Same as lease
    
    const annualCapexDepreciation = availableForFacilities * ((100 - leaseAllocation) / 100);
    const totalCapexAllowed = annualCapexDepreciation * leaseTermYears;
    
    return {
      tuition,
      leadGuides,
      guides,
      totalGuides: leadGuides + guides,
      guideRatio: students / (leadGuides + guides),
      headOfSchool,
      admin,
      guidesExpense,
      otherHCExpense,
      totalHeadcount,
      programsPerStudent: calculatePrograms(students),
      programs,
      misc,
      software,
      revenue,
      operatingExpenses,
      targetMargin,
      targetProfit,
      grossAvailable,
      availableForFacilities,
      leaseTermYears,
      leaseAndOtherTotal,
      annualLeaseAmount,
      annualOtherFacilities,
      annualCapexDepreciation,
      totalCapexAllowed,
      perStudentFacility: availableForFacilities / students,
      facilityMargin: availableForFacilities / revenue,
      actualMargin: (revenue - operatingExpenses - availableForFacilities) / revenue
    };
  };
  
  const models = useMemo(() => 
    tuitionLevels.map(t => calculateModel(t)), 
    [students, leaseAllocation]
  );
  
  const formatCurrency = (value) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };
  
  const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;
  
  const targetMargin = getTargetMargin(students);
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Alpha School Facility Budget Calculator</h1>
          <p className="text-blue-100">Calculate Lease, Other Facilities, and CapEx budgets with target margin requirements</p>
        </div>
        
        {/* Target Margin Banner */}
        <div className={`rounded-xl p-4 mb-6 border-2 ${
          targetMargin === 0 ? 'bg-yellow-50 border-yellow-400' :
          targetMargin === 0.15 ? 'bg-blue-50 border-blue-400' :
          'bg-green-50 border-green-400'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">
                Target Margin: {formatPercent(targetMargin)}
                {targetMargin === 0 && ' (Breakeven)'}
              </h3>
              <p className="text-sm text-gray-600">
                At {students} students, facility budget is reduced to ensure {targetMargin === 0 ? 'breakeven' : `${formatPercent(targetMargin)} profit margin`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Margin Tiers:</div>
              <div className="flex gap-3 text-xs">
                <span className={`px-2 py-1 rounded ${students < 30 ? 'bg-yellow-200 font-bold' : 'bg-gray-100'}`}>&lt;30: 0%</span>
                <span className={`px-2 py-1 rounded ${students >= 30 && students <= 100 ? 'bg-blue-200 font-bold' : 'bg-gray-100'}`}>30-100: 15%</span>
                <span className={`px-2 py-1 rounded ${students > 100 ? 'bg-green-200 font-bold' : 'bg-gray-100'}`}>100+: 25%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Input Parameters</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Student Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Students: <span className="text-blue-600 font-bold text-lg">{students}</span>
              </label>
              <input
                type="range"
                min="10"
                max="300"
                value={students}
                onChange={(e) => setStudents(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10</span>
                <span className="text-yellow-600">30</span>
                <span className="text-blue-600">100</span>
                <span>200</span>
                <span>300</span>
              </div>
              <input
                type="number"
                min="10"
                max="500"
                value={students}
                onChange={(e) => setStudents(Math.max(10, Math.min(500, parseInt(e.target.value) || 10)))}
                className="mt-2 w-24 px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            {/* Lease vs CapEx Allocation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facility Budget Allocation
              </label>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm text-green-600 font-medium">Lease + Other: {leaseAllocation}%</span>
                <span className="text-sm text-purple-600 font-medium">CapEx: {100 - leaseAllocation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={leaseAllocation}
                onChange={(e) => setLeaseAllocation(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100% CapEx</span>
                <span>50/50</span>
                <span>100% Lease+Other</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">
                Note: Lease and Other Facilities are always equal (each gets half of the Lease+Other allocation)
              </p>
            </div>
          </div>
        </div>
        
        {/* Derived Parameters */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">Auto-Calculated Parameters</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Lead Guides:</span>
              <span className="ml-2 font-bold">{models[0].leadGuides}</span>
            </div>
            <div>
              <span className="text-blue-600">Guides:</span>
              <span className="ml-2 font-bold">{models[0].guides}</span>
            </div>
            <div>
              <span className="text-blue-600">Ratio:</span>
              <span className="ml-2 font-bold">{models[0].guideRatio.toFixed(1)}:1</span>
            </div>
            <div>
              <span className="text-blue-600">Head of School:</span>
              <span className="ml-2 font-bold">{models[0].headOfSchool}</span>
            </div>
            <div>
              <span className="text-blue-600">Lease Term:</span>
              <span className="ml-2 font-bold">{models[0].leaseTermYears} years</span>
            </div>
            <div>
              <span className="text-blue-600">Target Margin:</span>
              <span className="ml-2 font-bold">{formatPercent(targetMargin)}</span>
            </div>
          </div>
        </div>
        
        {/* Results Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {models.map((model, idx) => (
            <div 
              key={model.tuition}
              className={`bg-white rounded-xl shadow-sm overflow-hidden border-t-4 ${
                idx === 0 ? 'border-amber-500' : idx === 1 ? 'border-blue-500' : 'border-emerald-500'
              }`}
            >
              <div className={`px-6 py-4 ${
                idx === 0 ? 'bg-amber-50' : idx === 1 ? 'bg-blue-50' : 'bg-emerald-50'
              }`}>
                <h3 className="text-xl font-bold text-gray-800">
                  {formatCurrency(model.tuition)} Tuition
                </h3>
                <p className="text-sm text-gray-600">Revenue: {formatCurrency(model.revenue)}</p>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Expenses */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Operating Expenses</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guides ({model.leadGuides} Lead + {model.guides} Guide)</span>
                      <span className="font-medium">{formatCurrency(model.guidesExpense)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other HC (HoS: {model.headOfSchool}, Admin: {model.admin})</span>
                      <span className="font-medium">{formatCurrency(model.otherHCExpense)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Programs (${model.programsPerStudent.toLocaleString()}/student)</span>
                      <span className="font-medium">{formatCurrency(model.programs)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Misc + Software</span>
                      <span className="font-medium">{formatCurrency(model.misc + model.software)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 font-semibold">
                      <span>Total Operating</span>
                      <span>{formatCurrency(model.operatingExpenses)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Target Profit Reserve */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-orange-800">
                      Target Profit Reserve ({formatPercent(model.targetMargin)})
                    </span>
                    <span className="font-bold text-orange-700">{formatCurrency(model.targetProfit)}</span>
                  </div>
                  <div className="text-xs text-orange-600 mt-1">
                    Gross available: {formatCurrency(model.grossAvailable)} → Net: {formatCurrency(model.availableForFacilities)}
                  </div>
                </div>
                
                {/* Available for Facilities */}
                <div className={`rounded-lg p-4 ${
                  model.availableForFacilities >= 0 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Available for Facilities</h4>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {formatCurrency(model.availableForFacilities)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(model.perStudentFacility)}/student • {formatPercent(model.facilityMargin)} of revenue
                  </div>
                </div>
                
                {/* Facility Breakdown - 3 components */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Facility Allocation (3 Components)</h4>
                  <div className="space-y-2">
                    {/* Lease */}
                    <div className="flex justify-between items-center bg-green-50 rounded p-2">
                      <span className="text-sm text-green-700">Annual Lease</span>
                      <span className="font-bold text-green-700">{formatCurrency(model.annualLeaseAmount)}</span>
                    </div>
                    {/* Other Facilities */}
                    <div className="flex justify-between items-center bg-teal-50 rounded p-2">
                      <span className="text-sm text-teal-700">Annual Other Facilities</span>
                      <span className="font-bold text-teal-700">{formatCurrency(model.annualOtherFacilities)}</span>
                    </div>
                    {/* Lease + Other subtotal */}
                    <div className="flex justify-between items-center text-xs text-gray-500 px-2">
                      <span>Lease + Other Subtotal ({leaseAllocation}%)</span>
                      <span>{formatCurrency(model.leaseAndOtherTotal)}</span>
                    </div>
                    {/* CapEx Depreciation */}
                    <div className="flex justify-between items-center bg-purple-50 rounded p-2">
                      <span className="text-sm text-purple-700">Annual CapEx Depreciation ({100 - leaseAllocation}%)</span>
                      <span className="font-bold text-purple-700">{formatCurrency(model.annualCapexDepreciation)}</span>
                    </div>
                    {/* Total CapEx */}
                    <div className="bg-purple-100 rounded-lg p-3 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-purple-800">
                          Total CapEx Allowed ({model.leaseTermYears}yr)
                        </span>
                        <span className="text-lg font-bold text-purple-900">{formatCurrency(model.totalCapexAllowed)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Reference Tables */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Margin Rules */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Target Margin Rules</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Students</th>
                  <th className="px-3 py-2 text-left">Target Margin</th>
                </tr>
              </thead>
              <tbody>
                <tr className={students < 30 ? 'bg-yellow-50' : ''}>
                  <td className="px-3 py-2 border-t">&lt;30</td>
                  <td className="px-3 py-2 border-t font-medium">0% (Breakeven)</td>
                </tr>
                <tr className={students >= 30 && students <= 100 ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2 border-t">30-100</td>
                  <td className="px-3 py-2 border-t font-medium">15%</td>
                </tr>
                <tr className={students > 100 ? 'bg-green-50' : ''}>
                  <td className="px-3 py-2 border-t">100+</td>
                  <td className="px-3 py-2 border-t font-medium">25%</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Staffing Rules */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Staffing Rules</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Students</th>
                  <th className="px-3 py-2 text-left">Lead Guides</th>
                </tr>
              </thead>
              <tbody>
                <tr className={students <= 25 ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2 border-t">1-25</td>
                  <td className="px-3 py-2 border-t">1 @ $200k</td>
                </tr>
                <tr className={students > 25 && students <= 125 ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2 border-t">26-125</td>
                  <td className="px-3 py-2 border-t">2 @ $200k</td>
                </tr>
                <tr className={students > 125 && students <= 149 ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2 border-t">126-149</td>
                  <td className="px-3 py-2 border-t">3 @ $200k</td>
                </tr>
                <tr className={students >= 150 ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2 border-t">150+</td>
                  <td className="px-3 py-2 border-t">4 @ $200k</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Lease Rules */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Lease & CapEx Rules</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Students</th>
                  <th className="px-3 py-2 text-left">Term</th>
                </tr>
              </thead>
              <tbody>
                <tr className={students < 100 ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2 border-t">&lt;100</td>
                  <td className="px-3 py-2 border-t">2 years</td>
                </tr>
                <tr className={students >= 100 && students <= 250 ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2 border-t">100-250</td>
                  <td className="px-3 py-2 border-t">5 years</td>
                </tr>
                <tr className={students > 250 ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2 border-t">250+</td>
                  <td className="px-3 py-2 border-t">10 years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Comparison Summary */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Comparison at {students} Students (Target: {formatPercent(targetMargin)} margin)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Metric</th>
                  <th className="px-4 py-3 text-right text-amber-600">$40k Tuition</th>
                  <th className="px-4 py-3 text-right text-blue-600">$50k Tuition</th>
                  <th className="px-4 py-3 text-right text-emerald-600">$65k Tuition</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-t font-medium">Revenue</td>
                  {models.map((m, i) => (
                    <td key={i} className="px-4 py-2 border-t text-right">{formatCurrency(m.revenue)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t font-medium">Operating Expenses</td>
                  {models.map((m, i) => (
                    <td key={i} className="px-4 py-2 border-t text-right">{formatCurrency(m.operatingExpenses)}</td>
                  ))}
                </tr>
                <tr className="bg-orange-50">
                  <td className="px-4 py-2 border-t font-medium">Target Profit Reserve</td>
                  {models.map((m, i) => (
                    <td key={i} className="px-4 py-2 border-t text-right text-orange-700">{formatCurrency(m.targetProfit)}</td>
                  ))}
                </tr>
                <tr className="bg-green-50">
                  <td className="px-4 py-2 border-t font-bold">Available for Facilities</td>
                  {models.map((m, i) => (
                    <td key={i} className="px-4 py-2 border-t text-right font-bold">{formatCurrency(m.availableForFacilities)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t font-medium text-green-700">Annual Lease</td>
                  {models.map((m, i) => (
                    <td key={i} className="px-4 py-2 border-t text-right text-green-700">{formatCurrency(m.annualLeaseAmount)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t font-medium text-teal-700">Annual Other Facilities</td>
                  {models.map((m, i) => (
                    <td key={i} className="px-4 py-2 border-t text-right text-teal-700">{formatCurrency(m.annualOtherFacilities)}</td>
                  ))}
                </tr>
                <tr className="bg-purple-50">
                  <td className="px-4 py-2 border-t font-bold">Total CapEx Allowed</td>
                  {models.map((m, i) => (
                    <td key={i} className="px-4 py-2 border-t text-right font-bold text-purple-700">{formatCurrency(m.totalCapexAllowed)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Facility Allocation Explanation */}
        <div className="mt-6 bg-gray-100 rounded-xl p-4">
          <h4 className="font-semibold text-gray-700 mb-2">Facility Budget Allocation Logic</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• <strong>Lease + Other Facilities</strong> = Available × {leaseAllocation}% = split equally between Lease and Other Facilities</p>
            <p>• <strong>CapEx</strong> = Available × {100 - leaseAllocation}%</p>
            <p>• <strong>Total CapEx Allowed</strong> = Annual CapEx × Lease Term Years</p>
            <p className="italic mt-2">Other Facilities covers: utilities, maintenance, insurance, property taxes, etc.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphaFacilityCalculator;
