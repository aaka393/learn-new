// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};

// This script serves as a guide for setting up Strapi manually
// as Strapi installation requires interactive prompts and cannot be fully automated

console.log("\n========== STRAPI SETUP GUIDE ==========\n");
console.log("To set up the Strapi backend, follow these steps:\n");
console.log("1. Open a new terminal window");
console.log("2. Run the following commands:\n");
console.log("   npx create-strapi-app@latest strapi-backend --quickstart");
console.log("   cd strapi-backend");
console.log("   npm run develop\n");
console.log("3. When Strapi opens in your browser:");
console.log("   - Create an admin account");
console.log("   - Go to Content-Type Builder");
console.log("   - Create the following Collection Types:\n");

console.log("   Header Collection Type:");
console.log("     - title (Text)");
console.log("     - menu_items (Component - Create new 'MenuItem' with fields:");
console.log("       * label (Text)");
console.log("       * slug (Text))");
console.log("     - Set menu_items as repeatable\n");

console.log("   Album Collection Type:");
console.log("     - name (Text)");
console.log("     - photos (Media - multiple)\n");

console.log("4. Create sample data:");
console.log("   - Create a Header with title 'Yensi Solution'");
console.log("   - Add menu items: Home (slug: home), Articles (slug: articles), Gallery (slug: gallery), About (slug: about), Author (slug: author)");
console.log("   - Create two albums: 'Nature' with 3 photos and 'House' with 2 photos\n");

console.log("5. Set permissions:");
console.log("   - Go to Settings > USERS & PERMISSIONS PLUGIN > Roles > Public");
console.log("   - Enable 'find' and 'findOne' for Header and Album collection types");
console.log("   - Save\n");

console.log("6. Update the API URL in the frontend:");
console.log("   - Make sure the API URL in src/services/api.ts matches your Strapi URL (default: http://localhost:1337/api)\n");

console.log("========================================\n");

console.log("Note: The React frontend is already set up to connect to Strapi once it's running.");
console.log("Run the frontend with 'npm run dev' after setting up Strapi.\n");
