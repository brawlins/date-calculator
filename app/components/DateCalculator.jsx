"use client";

import React, { useState } from "react";
import { Calendar, Plus, Minus, X, Calculator } from "lucide-react";

export default function DateCalculator() {
  const [mode, setMode] = useState("calculator"); // 'calculator' or 'difference'
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [operations, setOperations] = useState([]);
  const [resultDate, setResultDate] = useState(null);

  // Date difference states
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [dateDifference, setDateDifference] = useState(null);

  const unitOptions = [
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" },
    { value: "years", label: "Years" },
  ];

  const addOperation = () => {
    setOperations([
      ...operations,
      {
        id: Date.now(),
        operation: "add",
        value: 1,
        unit: "days",
      },
    ]);
  };

  const removeOperation = (id) => {
    setOperations(operations.filter((op) => op.id !== id));
  };

  const updateOperation = (id, field, value) => {
    setOperations(
      operations.map((op) => (op.id === id ? { ...op, [field]: value } : op))
    );
  };

  const calculateResult = () => {
    // Create date in local timezone to avoid timezone issues
    const dateParts = startDate.split("-");
    let result = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );

    operations.forEach((op) => {
      const multiplier = op.operation === "add" ? 1 : -1;
      const amount = parseInt(op.value) * multiplier;

      switch (op.unit) {
        case "days":
          result.setDate(result.getDate() + amount);
          break;
        case "weeks":
          result.setDate(result.getDate() + amount * 7);
          break;
        case "months":
          result.setMonth(result.getMonth() + amount);
          break;
        case "years":
          result.setFullYear(result.getFullYear() + amount);
          break;
        default:
          break;
      }
    });

    setResultDate(result);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDateDifference = () => {
    // Create dates in local timezone to avoid timezone issues
    const fromParts = fromDate.split("-");
    const toParts = toDate.split("-");
    const from = new Date(
      parseInt(fromParts[0]),
      parseInt(fromParts[1]) - 1,
      parseInt(fromParts[2])
    );
    const to = new Date(
      parseInt(toParts[0]),
      parseInt(toParts[1]) - 1,
      parseInt(toParts[2])
    );

    // Calculate absolute difference in milliseconds
    const diffMs = Math.abs(to.getTime() - from.getTime());

    // Convert to different units
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44); // Average days per month
    const diffYears = Math.floor(diffDays / 365.25); // Account for leap years

    // More precise month/year calculation
    // Always calculate from earlier to later date, then apply sign at the end
    const isNegative = to.getTime() < from.getTime();
    const earlierDate = isNegative ? to : from;
    const laterDate = isNegative ? from : to;

    let years = laterDate.getFullYear() - earlierDate.getFullYear();
    let months = laterDate.getMonth() - earlierDate.getMonth();
    let days = laterDate.getDate() - earlierDate.getDate();

    if (days < 0) {
      months--;
      const lastDayOfPrevMonth = new Date(
        laterDate.getFullYear(),
        laterDate.getMonth(),
        0
      ).getDate();
      days += lastDayOfPrevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Apply negative sign if needed
    if (isNegative) {
      years = -years;
      months = -months;
      days = -days;
    }

    setDateDifference({
      totalDays: isNegative ? -diffDays : diffDays,
      totalWeeks: isNegative ? -diffWeeks : diffWeeks,
      totalMonths: isNegative ? -diffMonths : diffMonths,
      totalYears: isNegative ? -diffYears : diffYears,
      precise: { years, months, days },
      isNegative,
    });
  };

  const clearAll = () => {
    if (mode === "calculator") {
      setOperations([]);
      setResultDate(null);
    } else {
      setDateDifference(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Date Calculator</h1>
        </div>

        {/* Mode Toggle */}
        <div className="flex mb-8 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setMode("calculator")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              mode === "calculator"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:text-white hover:bg-gray-600"
            }`}
          >
            Date Math
          </button>
          <button
            onClick={() => setMode("difference")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              mode === "difference"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:text-white hover:bg-gray-600"
            }`}
          >
            Date Difference
          </button>
        </div>

        {mode === "calculator" ? (
          <>
            {/* Date Calculator Mode */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Starting Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>

            {/* Operations */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Operations</h2>
                <div className="flex gap-2">
                  <button
                    onClick={addOperation}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add Operation
                  </button>
                  {operations.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {operations.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>
                    No operations added yet. Click "Add Operation" to get
                    started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {operations.map((op, index) => (
                    <div
                      key={op.id}
                      className="flex items-center gap-4 p-4 bg-gray-700 border border-gray-600 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-300 w-8">
                        {index + 1}.
                      </span>

                      <select
                        value={op.operation}
                        onChange={(e) =>
                          updateOperation(op.id, "operation", e.target.value)
                        }
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="add">Add</option>
                        <option value="subtract">Subtract</option>
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={op.value}
                        onChange={(e) =>
                          updateOperation(op.id, "value", e.target.value)
                        }
                        className="w-20 px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />

                      <select
                        value={op.unit}
                        onChange={(e) =>
                          updateOperation(op.id, "unit", e.target.value)
                        }
                        className="px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {unitOptions.map((unit) => (
                          <option key={unit.value} value={unit.value}>
                            {unit.label}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => removeOperation(op.id)}
                        className="p-2 text-red-400 hover:bg-red-900 hover:bg-opacity-30 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculate Button */}
            {operations.length > 0 && (
              <div className="mb-8">
                <button
                  onClick={calculateResult}
                  className="w-full md:w-auto px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Result
                </button>
              </div>
            )}

            {/* Result */}
            {resultDate && (
              <div className="bg-gradient-to-r from-green-900 to-emerald-900 border border-green-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-200 mb-2">
                  Result
                </h3>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-green-100">
                    {formatDate(resultDate)}
                  </p>
                  <p className="text-green-300">
                    {resultDate.toISOString().split("T")[0]}
                  </p>

                  {/* Show calculation summary */}
                  <div className="mt-4 pt-4 border-t border-green-700">
                    <p className="text-sm text-green-200 font-medium mb-2">
                      Calculation Summary:
                    </p>
                    <div className="text-sm text-green-300">
                      <p>
                        Starting:{" "}
                        {formatDate(
                          new Date(
                            startDate.split("-")[0],
                            startDate.split("-")[1] - 1,
                            startDate.split("-")[2]
                          )
                        )}
                      </p>
                      {operations.map((op, index) => (
                        <p key={op.id}>
                          {op.operation === "add" ? "+ " : "- "}
                          {op.value} {op.unit}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Date Difference Mode */}
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={calculateDateDifference}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Difference
                </button>
                {dateDifference && (
                  <button
                    onClick={clearAll}
                    className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Date Difference Result */}
            {dateDifference && (
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-200 mb-4">
                  Time Difference
                </h3>

                {/* Precise breakdown */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-purple-300 mb-2">
                    Precise Difference:
                  </h4>
                  <p className="text-2xl font-bold text-purple-100">
                    {dateDifference.precise.years !== 0 &&
                      `${Math.abs(dateDifference.precise.years)} year${
                        Math.abs(dateDifference.precise.years) !== 1 ? "s" : ""
                      }`}
                    {dateDifference.precise.months !== 0 &&
                      ` ${Math.abs(dateDifference.precise.months)} month${
                        Math.abs(dateDifference.precise.months) !== 1 ? "s" : ""
                      }`}
                    {dateDifference.precise.days !== 0 &&
                      ` ${Math.abs(dateDifference.precise.days)} day${
                        Math.abs(dateDifference.precise.days) !== 1 ? "s" : ""
                      }`}
                    {dateDifference.precise.years === 0 &&
                      dateDifference.precise.months === 0 &&
                      dateDifference.precise.days === 0 &&
                      "Same date"}
                    {dateDifference.isNegative &&
                      dateDifference.totalDays !== 0 &&
                      " (in the past)"}
                  </p>
                </div>

                {/* Alternative representations */}
                {dateDifference.totalDays !== 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-purple-700">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-100">
                        {Math.abs(dateDifference.totalDays).toLocaleString()}
                      </p>
                      <p className="text-sm text-purple-300">Total Days</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-100">
                        {Math.abs(dateDifference.totalWeeks).toLocaleString()}
                      </p>
                      <p className="text-sm text-purple-300">Total Weeks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-100">
                        {Math.abs(dateDifference.totalMonths).toLocaleString()}
                      </p>
                      <p className="text-sm text-purple-300">Total Months</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-100">
                        {Math.abs(dateDifference.totalYears).toLocaleString()}
                      </p>
                      <p className="text-sm text-purple-300">Total Years</p>
                    </div>
                  </div>
                )}

                {/* Date range summary */}
                <div className="mt-4 pt-4 border-t border-purple-700">
                  <p className="text-sm text-purple-200 font-medium mb-2">
                    Date Range:
                  </p>
                  <div className="text-sm text-purple-300">
                    <p>
                      From:{" "}
                      {formatDate(
                        new Date(
                          fromDate.split("-")[0],
                          fromDate.split("-")[1] - 1,
                          fromDate.split("-")[2]
                        )
                      )}
                    </p>
                    <p>
                      To:{" "}
                      {formatDate(
                        new Date(
                          toDate.split("-")[0],
                          toDate.split("-")[1] - 1,
                          toDate.split("-")[2]
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
