const { exec } = require('child_process');
const util = require('util');

// Promisify exec to use async/await
const execPromise = util.promisify(exec);

const killPort = async (port) => {
  try {
    // Use netstat to find the PID using the port
    const { stdout } = await execPromise(`netstat -a -n -o | find "${port}"`);
    const lines = stdout.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const address = parts[1]; // Local Address column
      const pid = parts[4]; // PID column

      if (address.includes(`:${port}`)) {
        console.log(`Killing process on port ${port} with PID ${pid}...`);
        await execPromise(`taskkill /PID ${pid} /F`);
        console.log(`Process with PID ${pid} killed.`);
      }
    }
  } catch (err) {
    if (err.message.includes('No process is using the port')) {
      console.log(`No process found on port ${port}.`);
    } else {
      console.error(`Error killing process on port ${port}:`, err.message);
    }
  }
};

// Export the function
module.exports = killPort;

// If run directly, kill the specified port
if (require.main === module) {
  const port = process.argv[2] || 5000; // Default to port 5000 if not specified
  killPort(port);
}