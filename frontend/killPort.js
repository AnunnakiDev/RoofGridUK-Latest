const { exec } = require('child_process');
const util = require('util');

// Convert exec to a promise-based function
const execPromise = util.promisify(exec);

const port = process.argv[2] || 3000; // Default to port 3000 if not specified

async function killPort() {
  try {
    console.log(`Attempting to kill processes on port ${port}...`);

    // Use netstat to find the PID of the process using the port
    const { stdout } = await execPromise(`netstat -aon | findstr :${port}`);
    const lines = stdout.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      console.log(`No process found on port ${port}.`);
      return;
    }

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1]; // Last column is the PID
      if (pid && !isNaN(pid)) {
        console.log(`Killing process with PID ${pid} on port ${port}...`);
        await execPromise(`taskkill /PID ${pid} /F`);
        console.log(`Process with PID ${pid} killed successfully.`);
      }
    }
  } catch (error) {
    console.error(`Error killing process on port ${port}:`, error.message);
  }
}

killPort();