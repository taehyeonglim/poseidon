import dotenv from 'dotenv';
import { createApp } from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = createApp();

// Start server
app.listen(PORT, () => {
    console.log(`🌊 POSEIDON API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔧 Provider mode: ${process.env.PROVIDER_MODE || 'mock'}`);
    console.log(`⚡ Ready to serve requests`);
});
