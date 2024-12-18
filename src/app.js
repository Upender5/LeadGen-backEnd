const app = require('./config/server');

// Routes
const leadRoutes = require('./routes/leadRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const tenantRoutes = require('./routes/tenantRoutes');

app.use('/api/leads', leadRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/tenants', tenantRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
