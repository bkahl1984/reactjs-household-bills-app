'use client';
import { useEffect, useState } from 'react';

const App = () => {
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ Replace this with your public Google Sheets JSON endpoint:
        const sheetId = process.env.REACT_APP_GOOGLE_SPREADSHEET_SHEET_ID;
        const range = process.env.REACT_APP_GOOGLE_SPREADSHEET_RANGE;
        const apiKey = process.env.REACT_APP_GOOGLE_SPREADSHEET_API_KEY;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        setRows(data.values || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  if (rows.length === 0) return <p>Loading...</p>;

  const headers = rows[0];
  const dataRows = rows.slice(1);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Monthly Utilities Overview</h1>
      
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  backgroundColor: '#4CAF50',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
              {row.map((cell, cellIndex) => {
                const nextRow = dataRows[rowIndex + 1];
                let nextValue = 0;
                
                if (nextRow && cellIndex > 0) {
                  const currentNumber = parseFloat(cell.replace(/[^0-9.]/g, '')) || 0;
                  const nextNumber = parseFloat(nextRow[cellIndex].replace(/[^0-9.]/g, '')) || 0;
                  nextValue = currentNumber - nextNumber;
                }

                const nextValueFixed = nextValue.toFixed(2);

                return (
                  <td
                    key={cellIndex}
                    style={{
                      border: '1px solid #ddd',
                      padding: '10px',
                      textAlign: 'center',
                      color: '#333333',
                    }}
                  >
                    {cellIndex === 0 && cell}
                    {cell === '' && '-'}
                    {cellIndex > 0 && nextRow !== undefined && cell !== '' &&
                      <span>
                        {cell} <span style={{
                          color: nextValueFixed.includes('-') || nextValueFixed === "0.00" ? 'green' : 'red',
                          fontWeight: 'bold'
                        }}>
                          {nextValueFixed.includes('-') || nextValueFixed === "0.00" ? '' : '+'}
                          {row.toString().split(",")[0] !== 'January 2025' && nextValueFixed}
                        </span>
                      </span>
                    }
                    {cellIndex > 0 && nextRow === undefined && cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;