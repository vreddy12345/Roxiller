
const express = require('express');
const axios = require('axios');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;


async function fetchJSONData() {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching data from the third-party API:', error.message);
    return [];
  }
}
app.get('/', (req, res) => {
    res.send('Welcome to the Node.js API!');
  });

app.get('/api/initialize-database', async (req, res) => {
  try {
    const jsonData = await fetchJSONData();
    if (jsonData.length === 0) {
      return res.status(500).json({ message: 'Failed to fetch data from the third-party API.' });
    }

    
    db.run('DELETE FROM products');

   
    const insertStmt = db.prepare('INSERT INTO products (name, price, dateOfSale, category, sold) VALUES (?, ?, ?, ?, ?)');
    jsonData.forEach((product) => {
      insertStmt.run(product.name, product.price, product.dateOfSale, product.category, product.sold);
    });
    insertStmt.finalize();

    res.json({ message: 'Database initialized successfully with seed data.' });
  } catch (error) {
    console.error('Error initializing the database:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


app.get('/api/statistics/:month', (req, res) => {
  const selectedMonth = req.params.month;

  
  
  res.json({
    totalSaleAmount: 1500.0,
    totalSoldItems: 30,
    totalNotSoldItems: 5,
  });
});


app.get('/api/bar-chart/:month', (req, res) => {
  const selectedMonth = req.params.month;

  
  res.json([
    { priceRange: '0 - 100', count: 10 },
    { priceRange: '101 - 200', count: 15 },
    { priceRange: '201 - 300', count: 20 },
    
  ]);
});


app.get('/api/pie-chart/:month', (req, res) => {
  const selectedMonth = req.params.month;

  
  res.json([
    { category: 'Category X', count: 20 },
    { category: 'Category Y', count: 5 },
    { category: 'Category Z', count: 3 },
    
  ]);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/api/combined-response/:month', async (req, res) => {
    const selectedMonth = req.params.month;
  
    try {
      
      const statisticsResponse = await axios.get(`http://localhost:${PORT}/api/statistics/${selectedMonth}`);
      const statisticsData = statisticsResponse.data;
  
      
      const barChartResponse = await axios.get(`http://localhost:${PORT}/api/bar-chart/${selectedMonth}`);
      const barChartData = barChartResponse.data;
  
     
      const pieChartResponse = await axios.get(`http://localhost:${PORT}/api/pie-chart/${selectedMonth}`);
      const pieChartData = pieChartResponse.data;
  
      
      const combinedResponse = {
        statistics: statisticsData,
        barChart: barChartData,
        pieChart: pieChartData,
      };
  
      res.json(combinedResponse);
    } catch (error) {
      console.error('Error fetching combined response:', error.message);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
  