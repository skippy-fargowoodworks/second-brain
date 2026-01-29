import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.note.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.credential.deleteMany();

  // Seed Tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Fix Commerce API 403 Error",
        description: "Admin users getting 403 Forbidden on /api/commerce/admin/* routes. Need to debug auth middleware.",
        status: "in-progress",
        priority: "critical",
        category: "Migration",
        tags: "backend,bug,auth",
      },
      {
        title: "Build Second Brain App",
        description: "Create a task/notes management app for tracking work with Jake",
        status: "done",
        priority: "high",
        category: "Development",
        tags: "app,nextjs,replit",
      },
      {
        title: "Connect WooCommerce Import",
        description: "Enter API credentials in Production OS importer and test product import",
        status: "todo",
        priority: "high",
        category: "Migration",
        tags: "woocommerce,import,products",
      },
      {
        title: "Configure Product Options",
        description: "Set up wood types, sizes, and customization options in the Option Library",
        status: "todo",
        priority: "medium",
        category: "Migration",
        tags: "products,options,configuration",
      },
      {
        title: "Recreate Content Pages",
        description: "About, FAQ, Shipping Policy, Terms of Service, Privacy Policy",
        status: "todo",
        priority: "medium",
        category: "Content",
        tags: "pages,seo,content",
      },
    ],
  });

  // Seed Notes
  await prisma.note.createMany({
    data: [
      {
        title: "Production OS Commerce Features",
        content: `The Production OS commerce system is MORE capable than Shopify for custom furniture:

Built-in features that would cost $150+/mo in Shopify apps:
- Deposit-based checkout (50% configurable)
- Option Library with conditional rules
- White Glove/Freight shipping options
- Production system integration
- Customer Portal with order tracking

Key locations:
- Option Library: /admin/commerce/options
- Rules: /admin/commerce/rules
- Templates: /admin/commerce/product-templates`,
        category: "reference",
        tags: "commerce,features,shopify",
      },
      {
        title: "Migration Priority List",
        content: `Priority order for migration:
1. Fix API auth issues (blocking everything)
2. Import products from WooCommerce
3. Configure option groups for customization
4. Set up shipping zones
5. Create content pages
6. Test checkout flow`,
        category: "projects",
        tags: "migration,priority,plan",
      },
    ],
  });

  // Seed Conversations
  await prisma.conversation.createMany({
    data: [
      {
        title: "Migration Planning Session",
        participants: "Jake, Skippy",
        summary: "Discussed the migration from WordPress/WooCommerce to Production OS. Identified backend is more capable than expected.",
        decisions: "Focus on fixing 403 error first, then proceed with WooCommerce import.",
        date: new Date("2026-01-28"),
      },
    ],
  });

  // Seed Credentials
  await prisma.credential.createMany({
    data: [
      {
        service: "Production OS",
        username: "Skippy",
        password: "Sk1ppy@Fargo2026!",
        url: "https://fargowoodworks1.com/login",
        notes: "Admin account for testing",
      },
      {
        service: "GitHub",
        username: "skippy-fargowoodworks",
        password: "Sk1ppy-G1tHub-2026!",
        url: "https://github.com/skippy-fargowoodworks",
        notes: "Collaborator on repo",
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
