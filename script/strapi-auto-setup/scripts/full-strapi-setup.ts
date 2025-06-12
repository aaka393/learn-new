import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { execSync, spawn } from 'child_process';
import * as net from 'net'; // Import the net module for port checking

// Define project name and Strapi port
const projectName = 'blog-backend';
// Construct the absolute path to the project root
const projectRoot = path.join(__dirname, '..', projectName);
const strapiPort = 1337;
const baseURL = `http://localhost:${strapiPort}`;

// Admin user credentials for registration
const adminUser = {
  firstname: 'admin',
  lastname: 'user',
  email: 'admin@gmail.com',
  password: 'asdF12345' // Ensure this meets Strapi's password policy (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
};

let adminJwtToken: string | null = null; // Variable to store the JWT token

/**
 * Utility function to introduce a delay.
 * @param ms - The number of milliseconds to wait.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Checks if a given port is currently in use.
 * @param port - The port number to check.
 * @returns A Promise that resolves to true if the port is in use, false otherwise.
 */
async function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Port is in use
      } else {
        // Other errors (e.g., EACCES for permission issues) are not a "port in use" scenario
        // but indicate an issue preventing us from listening.
        console.error(`Error checking port ${port}: ${err.message}`);
        resolve(false); // Assume not in use, but with a warning/error
      }
    });
    server.once('listening', () => {
      server.close(() => {
        resolve(false); // Port is free
      });
    });
    server.listen(port);
  });
}

/**
 * Sets up the Strapi project if it doesn't already exist.
 * Uses `npx create-strapi-app` for quick initialization.
 */
function setupStrapiProject(): void {
  console.log(`Current script directory: ${__dirname}`);
  console.log(`Resolved project root: ${projectRoot}`);

  if (!fs.existsSync(projectRoot)) {
    console.log('📦 Creating Strapi project...');
    try {
      console.log(`Executing: npx create-strapi-app@latest ${projectName} --quickstart in ${path.join(__dirname, '..')}`);
      execSync(`npx create-strapi-app@latest ${projectName} --quickstart`, {
        stdio: 'inherit', // Display output in the console
        cwd: path.join(__dirname, '..'), // Run create-strapi-app in the parent directory
      });
      console.log('Attempted Strapi project creation command.');
      // After attempting creation, check if the directory now exists.
      if (!fs.existsSync(projectRoot)) {
        throw new Error('Strapi project directory was not created after command execution.');
      }
      console.log('✅ Strapi project created successfully or already exists based on directory check.');
    } catch (error: any) {
      // Catching the error here to specifically check if the directory was created despite the error
      console.warn('⚠️ Warning: npx create-strapi-app command threw an error. Checking if project was created anyway...');
      if (!fs.existsSync(projectRoot)) {
        console.error('❌ Strapi project directory still does not exist. Full error:', error);
        process.exit(1); // Only exit if the directory genuinely wasn't created
      } else {
        console.log('✅ Strapi project directory exists despite the command error. Continuing...');
      }
    }
  } else {
    console.log('✅ Strapi project already exists. Skipping creation.');
  }
}

/**
 * Starts the Strapi development server.
 * Waits for a specific log message indicating the admin panel URL is ready.
 * Includes port availability check with retries.
 * @returns A Promise that resolves when the server is deemed ready.
 */
function startStrapiDevServer(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    console.log('🚀 Starting Strapi dev server...');
    console.log(`Spawning 'npm run develop' in directory: ${projectRoot}`);

    const maxPortCheckRetries = 5;
    const portCheckDelay = 2000; // 2 seconds

    // Phase 1: Check port availability before starting Strapi
    for (let i = 0; i < maxPortCheckRetries; i++) {
      if (await isPortInUse(strapiPort)) {
        console.warn(`⚠️ Port ${strapiPort} is currently in use. Retrying in ${portCheckDelay / 1000} seconds... (Attempt ${i + 1}/${maxPortCheckRetries})`);
        await delay(portCheckDelay);
      } else {
        console.log(`✅ Port ${strapiPort} is free. Proceeding to start Strapi.`);
        break; // Port is free, exit loop
      }

      if (i === maxPortCheckRetries - 1) {
        reject(new Error(`Port ${strapiPort} is still in use after multiple attempts. Please free up the port manually (e.g., by killing any running Node.js processes) and try again.`));
        return; // Exit the promise
      }
    }

    // Phase 2: Start Strapi dev server
    const devProcess = spawn('npm', ['run', 'develop'], {
      cwd: projectRoot,
      shell: true, // Use shell to ensure npm command is found
      env: { ...process.env, PORT: strapiPort.toString() } // Ensure Strapi starts on the correct port
    });

    let ready = false;

    // Listen for stdout data from the Strapi process
    devProcess.stdout.on('data', async (data) => {
      const output = data.toString();
      process.stdout.write(output); // Pipe Strapi's stdout to the current process's stdout

      // Check for the specific URL string indicating Strapi is serving the admin panel
      if (!ready && output.includes(`http://localhost:${strapiPort}/admin`)) {
        ready = true;
        console.log(`✅ Strapi admin panel URL detected: http://localhost:${strapiPort}/admin. Giving it more time to fully initialize...`);
        await delay(10000); // Increased delay for safety, allowing services to fully come up
        resolve(); // Resolve the promise once ready
      }
    });

    // Listen for stderr data from the Strapi process
    devProcess.stderr.on('data', (data) => {
      console.error('❌ STDERR from Strapi:', data.toString());
    });

    // Handle process errors
    devProcess.on('error', (err) => {
      console.error('❌ Failed to start Strapi process with error:', err.message);
      console.error('Full process error:', err);
      reject(err);
    });

    // Handle process exit
    devProcess.on('close', (code) => {
      console.log(`Strapi dev server process closed with code: ${code}`);
      if (code !== 0 && !ready) {
        reject(new Error(`Strapi process exited with code ${code} before becoming ready.`));
      }
    });

    devProcess.on('exit', (code, signal) => {
      console.log(`Strapi dev server process exited with code ${code} and signal ${signal}`);
    });
  });
}

/**
 * Waits for the Strapi admin initialization endpoint to be ready
 * and registers the admin user if one doesn't exist.
 * Includes robust retry logic and error handling for existing admin users.
 */
async function waitForInitAndRegisterAdmin(): Promise<void> {
  console.log('⏳ Waiting for Strapi /admin/init and attempting registration...');
  const maxPollingRetries = 30; // Retries for /admin/init endpoint
  const maxRegistrationRetries = 10; // Retries specifically for /admin/register-admin
  const retryDelay = 3000; // Increased delay between retries

  let adminExists = false; // True if /admin/init says admin exists, or if registration succeeds/says already exists

  // Phase 1: Poll /admin/init until it's reachable and gives a clear status
  console.log('Polling /admin/init endpoint...');
  for (let attempt = 1; attempt <= maxPollingRetries; attempt++) {
    try {
      const res = await axios.get(`${baseURL}/admin/init`, { timeout: 5000 });
      console.log(`🔍 [Init Poll Attempt ${attempt}] /admin/init reachable. hasAdmin: ${res.data?.data?.hasAdmin}`);

      if (typeof res.data?.data?.hasAdmin === 'boolean') {
        if (res.data.data.hasAdmin === true) {
          console.log('🧠 Admin already exists according to /admin/init. Skipping registration.');
          adminExists = true;
          break; // Exit polling loop, admin already exists
        } else { // hasAdmin === false
          console.log('✅ No admin found according to /admin/init. Will attempt registration.');
          adminExists = false;
          break; // Exit polling loop, proceed to registration
        }
      }
    } catch (err: any) {
      console.log(`⏳ [Init Poll Attempt ${attempt}/${maxPollingRetries}] /admin/init not ready or error: ${err.message}. Retrying...`);
    }
    await delay(retryDelay);
  }

  if (adminExists) {
      // If admin already exists, we are done with this step.
      return;
  }

  // Phase 2: If no admin found during polling, attempt registration with retries
  console.log('Attempting to register admin user with retries...');
  for (let attempt = 1; attempt <= maxRegistrationRetries; attempt++) {
    try {
      const reg = await axios.post(`${baseURL}/admin/register-admin`, adminUser, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('🎉 Admin registered successfully!');
      // Store the JWT token for subsequent authenticated API calls
      adminJwtToken = reg.data.data.token;
      fs.writeFileSync(path.join(projectRoot, 'admin-token.json'), JSON.stringify(reg.data, null, 2));
      return; // Registration successful, exit function
    } catch (regErr: any) {
      const errorMessage = regErr.response?.data?.error?.message || regErr.message;
      if (regErr.response?.status === 400 && errorMessage.includes('User already exists')) {
        console.log('🧠 Admin user already exists (detected during registration attempt). Skipping.');
        // If we reach here, it means admin exists, so we consider it successful for this step
        return;
      } else {
        console.log(`❌ [Registration Attempt ${attempt}/${maxRegistrationRetries}] Admin registration failed: ${errorMessage}. Retrying...`);
      }
    }
    await delay(retryDelay);
  }

  // If we reach here, both polling and registration attempts failed
  console.error('❌ Timeout: Strapi did not become ready for admin registration, or registration failed after all retries.');
  throw new Error('Strapi admin setup failed to register admin.');
}

/**
 * Attempts to log in the admin user using the registered credentials.
 * This verifies the registration was successful and retrieves a JWT.
 */
async function loginAdminUser(): Promise<void> {
  console.log('🔐 Attempting admin login...');
  // If adminJwtToken is already set from registration, we don't need to login again
  if (adminJwtToken) {
    console.log('🔑 Admin JWT already present from registration. Skipping explicit login.');
    return;
  }

  try {
    const response = await axios.post(`${baseURL}/admin/login`, {
      email: adminUser.email,
      password: adminUser.password,
    });

    console.log('✅ Admin login successful.');
    adminJwtToken = response.data.data.token; // Store the token
    console.log('🔑 Received JWT (first 10 chars):', adminJwtToken?.substring(0, 10) + '...');
    // You can save this token if you need to make authenticated requests later
  } catch (err: any) {
    console.error('❌ Admin login failed:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Error message:', err.message);
    }
    throw new Error('Admin login failed.'); // Re-throw to indicate overall setup failure
  }
}

/**
 * Creates or updates a single type schema in Strapi.
 * @param typeName - The name of the single type (e.g., 'header', 'footer', 'homepage').
 * @param attributes - An object defining the fields for the single type.
 */
async function createOrUpdateSingleTypeSchema(typeName: string, attributes: any): Promise<void> {
  if (!adminJwtToken) {
    throw new Error('Admin JWT token is not available. Cannot create content types.');
  }

  console.log(`🛠️ Creating/Updating single type schema: ${typeName}...`);
  try {
    const singularName = typeName.toLowerCase();
    const pluralName = `${singularName}s`; // Simple pluralization
    const uid = `api::${singularName}.${singularName}`;

    const payload = {
      contentType: {
        uid: uid,
        plugin: '', // Empty string for custom content types
        schema: {
          kind: 'singleType',
          displayName: typeName,
          pluralName: pluralName,
          singularName: singularName,
          attributes: attributes,
          options: {
            draftAndPublish: true,
          },
        },
      },
    };

    console.log(`Sending payload for ${typeName}:`, JSON.stringify(payload, null, 2)); // Debug payload

    const response = await axios.post(`${baseURL}/content-type-builder/content-types`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminJwtToken}`,
      },
    });

    console.log(`✅ Single type schema '${typeName}' created/updated successfully.`);
    await delay(5000); // Increased delay after schema creation, as Strapi rebuilds
  } catch (err: any) {
    const errorMessage = err.response?.data?.error?.message || err.message;
    if (err.response?.status === 409 && errorMessage.includes('already exists')) {
      console.log(`🧠 Single type schema '${typeName}' already exists. Skipping creation.`);
      await delay(1000);
    } else {
      console.error(`❌ Failed to create/update single type schema '${typeName}':`, errorMessage);
      if (err.response?.data) {
        console.error('Strapi API Error Details:', JSON.stringify(err.response.data, null, 2));
      }
      throw err;
    }
  }
}

/**
 * Populates data for a given single type.
 * For single types, it's typically a PUT request to create/update the single entry.
 * @param typeName - The name of the single type.
 * @param data - The data payload for the single type.
 */
async function populateSingleTypeData(typeName: string, data: any): Promise<void> {
  if (!adminJwtToken) {
    throw new Error('Admin JWT token is not available. Cannot populate content.');
  }

  console.log(`📝 Populating data for single type: ${typeName}...`);
  try {
    const response = await axios.put(`${baseURL}/api/${typeName.toLowerCase()}`, { data }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminJwtToken}`,
      },
    });

    console.log(`✅ Data populated successfully for '${typeName}'.`);
  } catch (err: any) {
    const errorMessage = err.response?.data?.error?.message || err.message;
    console.error(`❌ Failed to populate data for single type '${typeName}':`, errorMessage);
    if (err.response) {
      console.error('Full error response:', err.response.data);
    }
    throw err;
  }
}


// MAIN execution block
(async () => {
  console.clear(); // Clear console for cleaner output
  console.log('--- Starting Strapi Automatic Setup Script ---');
  try {
    setupStrapiProject();
    await startStrapiDevServer();
    await waitForInitAndRegisterAdmin();
    await loginAdminUser(); // This will now either log in or confirm JWT is set from registration

    // --- Create and Populate Single Types ---

    // Define schemas for header, footer, and homepage
    const headerSchema = {
      title: { type: 'string', required: true },
      description: { type: 'string' },
      logoText: { type: 'string' },
      navigationLinks: {
        type: 'json',
      }
    };
    const footerSchema = {
      copyrightText: { type: 'string', required: true },
      contactEmail: { type: 'email' },
      socialLinks: {
        type: 'json',
      }
    };
    const homepageSchema = {
      heroTitle: { type: 'string', required: true },
      heroSubtitle: { type: 'string' },
      bodyContent: { type: 'richtext' },
    };

    // Create/Update schemas
    await createOrUpdateSingleTypeSchema('Header', headerSchema);
    await createOrUpdateSingleTypeSchema('Footer', footerSchema);
    await createOrUpdateSingleTypeSchema('Homepage', homepageSchema);

    // Populate data for the single types
    await populateSingleTypeData('Header', {
      title: 'My Awesome Blog',
      description: 'Your daily dose of tech and more!',
      logoText: 'BlogCentral',
      navigationLinks: JSON.stringify([
        { label: 'Home', url: '/' },
        { label: 'About', url: '/about' },
        { label: 'Contact', url: '/contact' }
      ])
    });

    await populateSingleTypeData('Footer', {
      copyrightText: `© ${new Date().getFullYear()} BlogCentral. All rights reserved.`,
      contactEmail: 'info@blogcentral.com',
      socialLinks: JSON.stringify([
        { platform: 'Twitter', url: 'https://twitter.com/blogcentral' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/blogcentral' }
      ])
    });

    await populateSingleTypeData('Homepage', {
      heroTitle: 'Welcome to BlogCentral!',
      heroSubtitle: 'Exploring the world one article at a time.',
      bodyContent: '<h3>Latest Articles</h3><p>Stay tuned for exciting new content every week. We cover topics from web development to artificial intelligence.</p>'
    });

    console.log('\n✨ Strapi setup, admin registration/login, and content creation complete! ✨');
  } catch (err: any) {
    console.error('\n❌ Overall setup process failed:', err.message);
    process.exit(1); // Exit with a non-zero code to indicate failure
  }
})();
