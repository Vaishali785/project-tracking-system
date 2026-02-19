import { createProject } from './db.js';

/**
 * SEED SCRIPT
 * Populates database with sample projects for testing
 * Run with: npm run seed
 */

const sampleProjects = [
  {
    name: 'Website Redesign',
    clientName: 'Tech Corp',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-03-30'
  },
  {
    name: 'Mobile App Development',
    clientName: 'StartupXYZ',
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-06-15'
  },
  {
    name: 'Brand Identity',
    clientName: 'Fashion House',
    status: 'on_hold',
    startDate: '2024-01-20',
    endDate: '2024-04-10'
  },
  {
    name: 'E-commerce Platform',
    clientName: 'Retail Inc',
    status: 'completed',
    startDate: '2023-10-01',
    endDate: '2023-12-31'
  },
  {
    name: 'Marketing Campaign',
    clientName: 'Agency Partners',
    status: 'active',
    startDate: '2024-02-15',
    endDate: null // No end date set yet
  }
];

console.log('Seeding database with sample projects...\n');

sampleProjects.forEach((project, index) => {
  try {
    const created = createProject(project);
    console.log(`✓ Created project ${index + 1}: ${created.name}`);
  } catch (error) {
    console.error(`✗ Failed to create project ${index + 1}:`, error.message);
  }
});

console.log('\n✓ Database seeding complete!');
process.exit(0);
