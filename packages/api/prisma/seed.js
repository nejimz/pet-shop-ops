'use strict';

// DATABASE_URL must be set in environment before running.
// Run as: $env:DATABASE_URL="file:./dev.db"; node prisma/seed.js
// from inside packages/api.
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ── helpers ──────────────────────────────────────────────────────────────────

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function daysAgo(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function cuid() {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10);
  return `c${t}${r}`;
}

// ── data pools ────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  'James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda',
  'William','Barbara','David','Elizabeth','Richard','Susan','Joseph','Jessica',
  'Thomas','Sarah','Charles','Karen','Christopher','Lisa','Daniel','Nancy',
  'Matthew','Betty','Anthony','Margaret','Mark','Sandra','Donald','Ashley',
  'Steven','Dorothy','Paul','Kimberly','Andrew','Emily','Kenneth','Donna',
  'George','Michelle','Joshua','Carol','Kevin','Amanda','Brian','Melissa',
  'Edward','Deborah','Ronald','Stephanie','Timothy','Rebecca','Jason','Sharon',
  'Jeffrey','Laura','Ryan','Cynthia','Jacob','Kathleen','Gary','Amy',
  'Nicholas','Angela','Eric','Shirley','Jonathan','Anna','Stephen','Brenda',
  'Larry','Pamela','Justin','Emma','Scott','Nicole','Brandon','Helen',
  'Raymond','Samantha','Frank','Katherine','Gregory','Christine','Benjamin','Debra',
  'Samuel','Rachel','Patrick','Carolyn','Alexander','Janet','Jack','Catherine',
  'Dennis','Maria','Jerry','Heather','Tyler','Diane','Aaron','Julie',
];

const LAST_NAMES = [
  'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis',
  'Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas',
  'Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White',
  'Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young',
  'Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores',
  'Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell',
  'Carter','Roberts','Phillips','Evans','Turner','Torres','Parker','Collins',
  'Edwards','Stewart','Flores','Morris','Nguyen','Murphy','Rivera','Cook',
  'Rogers','Morgan','Peterson','Cooper','Reed','Bailey','Bell','Gomez',
  'Kelly','Howard','Ward','Cox','Diaz','Richardson','Wood','Watson',
  'Brooks','Bennett','Gray','James','Reyes','Cruz','Hughes','Price',
  'Myers','Long','Foster','Sanders','Ross','Morales','Powell','Sullivan',
];

const PET_NAMES = [
  'Max','Bella','Charlie','Luna','Cooper','Lucy','Milo','Daisy','Buddy','Lola',
  'Rocky','Sadie','Bear','Molly','Duke','Maggie','Tucker','Sophie','Oliver','Chloe',
  'Leo','Bailey','Teddy','Zoe','Jack','Lily','Bentley','Nala','Beau','Ellie',
  'Finn','Rosie','Cody','Ruby','Riley','Stella','Gus','Penny','Dexter','Roxy',
  'Zeus','Gracie','Murphy','Coco','Sam','Abby','Oscar','Sasha','Winston','Lexi',
  'Henry','Lulu','Louie','Winnie','Moose','Callie','Archie','Zoey','Brody','Kona',
];

const SPECIES = [
  { s: 'Dog', breeds: ['Labrador','Golden Retriever','Bulldog','Beagle','Poodle','Shih Tzu','German Shepherd','Siberian Husky','Chihuahua','Dachshund','Mixed Breed'] },
  { s: 'Cat', breeds: ['Persian','Maine Coon','Siamese','Ragdoll','Bengal','British Shorthair','Sphynx','Domestic Shorthair','Tabby','Mixed Breed'] },
  { s: 'Rabbit', breeds: ['Holland Lop','Flemish Giant','Mini Rex','Lionhead','Dutch'] },
  { s: 'Bird', breeds: ['Budgerigar','Cockatiel','African Grey','Lovebird','Canary'] },
  { s: 'Hamster', breeds: ['Syrian','Dwarf','Roborovski'] },
];

const PRODUCT_DATA = [
  // Dog food
  ['Premium Dry Dog Food 5kg','DF001',45.99],['Grain-Free Dog Food 3kg','DF002',38.50],
  ['Puppy Starter Pack','DF003',29.99],['Senior Dog Food 4kg','DF004',42.00],
  ['Wet Dog Food Variety Pack','DF005',24.99],['Dental Chew Treats 500g','DF006',15.99],
  ['Training Treats Chicken 300g','DF007',12.50],['Natural Dog Biscuits 400g','DF008',9.99],
  // Cat food
  ['Premium Cat Dry Food 4kg','CF001',38.99],['Kitten Milk Formula 200ml','CF002',18.00],
  ['Wet Cat Food Tuna 12pk','CF003',22.50],['Hairball Control Dry Food 2kg','CF004',32.00],
  ['Cat Treat Variety 250g','CF005',11.99],['Senior Cat Food 3kg','CF006',35.00],
  // Rabbit/small animal
  ['Timothy Hay 2kg','SA001',14.99],['Small Animal Pellets 1kg','SA002',11.50],
  ['Rabbit Treat Mix 300g','SA003',8.99],['Guinea Pig Food 1.5kg','SA004',13.00],
  // Bird
  ['Budgie Seed Mix 1kg','BR001',7.99],['Cockatiel Pellets 500g','BR002',12.50],
  ['Bird Vitamin Drops 30ml','BR003',9.99],['Cuttlefish Bone 2pk','BR004',4.50],
  // Accessories - bowls/beds
  ['Stainless Steel Dog Bowl Large','AC001',18.99],['Stainless Steel Cat Bowl','AC002',12.99],
  ['Orthopedic Dog Bed Large','AC003',89.99],['Cat Tree 150cm','AC004',129.99],
  ['Small Animal Cage Starter','AC005',74.99],['Rabbit Hutch Outdoor','AC006',149.99],
  // Grooming
  ['Dog Shampoo 500ml','GR001',16.99],['Cat Grooming Brush','GR002',14.50],
  ['Pet Nail Clippers','GR003',12.99],['Dog Ear Cleaner 100ml','GR004',11.00],
  ['De-shedding Glove','GR005',19.99],['Detangling Spray 250ml','GR006',13.50],
  // Health / supplements
  ['Joint Support Tablets 60ct','HL001',34.99],['Omega-3 Fish Oil Capsules 90ct','HL002',28.50],
  ['Probiotic Powder 100g','HL003',22.00],['Flea & Tick Collar Dog','HL004',19.99],
  ['Flea & Tick Collar Cat','HL005',17.99],['Calming Chews 30ct','HL006',24.99],
  ['Vitamin E Supplement 50ct','HL007',18.00],['Puppy Immune Booster 30ct','HL008',21.50],
  // Toys
  ['Rubber Chew Toy Large','TY001',9.99],['Interactive Puzzle Dog','TY002',24.99],
  ['Feather Wand Cat Toy','TY003',7.50],['Catnip Mice 3pk','TY004',6.99],
  ['Squeaky Plush Dog Toy','TY005',12.99],['Laser Pointer','TY006',8.50],
  ['Tug Rope Toy','TY007',11.00],['Ball Launcher','TY008',34.99],
  // Litter/hygiene
  ['Clumping Cat Litter 10kg','LT001',19.99],['Crystal Cat Litter 5kg','LT002',24.50],
  ['Litter Scoop Stainless','LT003',8.99],['Dog Waste Bags 120pk','LT004',7.99],
  ['Odour Eliminator Spray 500ml','LT005',13.50],['Litter Box Covered','LT006',39.99],
  // Carriers/leashes
  ['Soft Pet Carrier Medium','CR001',54.99],['Retractable Dog Leash 5m','CR002',22.99],
  ['Harness No-Pull Large','CR003',34.99],['Reflective Collar Dog Large','CR004',14.99],
  ['Cat Collar with Bell','CR005',8.50],['Dog ID Tag Stainless','CR006',6.99],
  // Misc
  ['Pet First Aid Kit','MX001',29.99],['Microchip Scanner','MX002',129.99],
  ['Automatic Pet Feeder','MX003',69.99],['Water Fountain Pet','MX004',49.99],
  ['Dog Cooling Mat Large','MX005',39.99],['Heated Pet Pad','MX006',44.99],
  ['Pet GPS Tracker','MX007',89.99],['Dog Car Seat Cover','MX008',34.99],
  ['Aquarium Starter Kit 20L','MX009',89.99],['Reptile Heat Lamp','MX010',24.99],
  ['Bird Cage Medium','MX011',79.99],['Hamster Wheel 21cm','MX012',12.99],
];

const APPT_TYPES = ['CHECKUP','VACCINE','GROOMING','OTHER'];
const APPT_STATUSES = ['COMPLETED','CANCELLED','NO_SHOW'];
const PAYMENT_METHODS = ['CASH','CARD','OTHER'];
const VISIT_NOTES = [
  'Routine checkup, all vitals normal.',
  'Vaccination administered, no adverse reactions.',
  'Grooming completed, coat and nails in good condition.',
  'Annual wellness exam, recommended dental cleaning.',
  'Follow-up visit, recovery progressing well.',
  'Weight check completed, diet adjustment recommended.',
  'Skin condition assessed, medicated shampoo prescribed.',
  'Ear infection treated, recheck in 2 weeks.',
  'Post-surgery follow-up, wound healing nicely.',
  'Dental scaling performed under sedation.',
];
const TREATMENTS = [
  'Flea treatment applied.','Deworming medication given.','Antibiotic course started.',
  'Anti-inflammatory prescribed.','Dental cleaning performed.','Minor wound sutured.',
  null, null, null,
];

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding database...');

  // Wipe existing data in dependency order
  await prisma.saleLine.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.owner.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──
  console.log('Creating users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.create({
    data: { id: cuid(), email: 'admin@petshop.local', name: 'Admin User', role: 'ADMIN', passwordHash },
  });
  const staffUsers = await Promise.all([
    prisma.user.create({ data: { id: cuid(), email: 'alice@petshop.local', name: 'Alice Santos', role: 'STAFF', passwordHash } }),
    prisma.user.create({ data: { id: cuid(), email: 'bob@petshop.local', name: 'Bob Reyes', role: 'STAFF', passwordHash } }),
    prisma.user.create({ data: { id: cuid(), email: 'carol@petshop.local', name: 'Carol Tan', role: 'STAFF', passwordHash } }),
  ]);
  const allUsers = [admin, ...staffUsers];
  console.log(`  ${allUsers.length} users created.`);

  // ── Products ──
  console.log('Creating 100 products...');
  const products = [];
  for (const [name, sku, price] of PRODUCT_DATA) {
    const p = await prisma.product.create({
      data: {
        id: cuid(),
        name,
        sku,
        price,
        stockQty: rand(0, 200),
        active: Math.random() > 0.05,
      },
    });
    products.push(p);
  }
  // Pad to 100 with extra generic products
  for (let i = products.length + 1; i <= 100; i++) {
    const p = await prisma.product.create({
      data: {
        id: cuid(),
        name: `Pet Supply Item ${i}`,
        sku: `GEN${String(i).padStart(3, '0')}`,
        price: parseFloat((rand(5, 150) + Math.random()).toFixed(2)),
        stockQty: rand(0, 150),
        active: Math.random() > 0.1,
      },
    });
    products.push(p);
  }
  console.log(`  ${products.length} products created.`);

  // ── Owners + Pets ──
  console.log('Creating 1000 owners and pets...');
  const owners = [];
  const pets = [];
  const OWNER_BATCH = 50;
  for (let i = 0; i < 1000; i += OWNER_BATCH) {
    const batch = Math.min(OWNER_BATCH, 1000 - i);
    for (let j = 0; j < batch; j++) {
      const firstName = pick(FIRST_NAMES);
      const lastName = pick(LAST_NAMES);
      const owner = await prisma.owner.create({
        data: {
          id: cuid(),
          name: `${firstName} ${lastName}`,
          phone: `+63${rand(900,999)}${String(rand(1000000,9999999))}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${rand(1,99)}@example.com`,
          address: `${rand(1,999)} ${pick(LAST_NAMES)} St, Barangay ${rand(1,50)}`,
          createdAt: randomDate(daysAgo(400), new Date()),
        },
      });
      owners.push(owner);

      // 1–4 pets per owner, ~15% chance of a 5th
      const petCount = rand(1, 4) + (Math.random() < 0.15 ? 1 : 0);
      for (let k = 0; k < petCount; k++) {
        const specEntry = pick(SPECIES);
        const sex = pick(['MALE','FEMALE','UNKNOWN']);
        const dob = Math.random() > 0.3 ? randomDate(daysAgo(365 * 15), daysAgo(60)) : null;
        const pet = await prisma.pet.create({
          data: {
            id: cuid(),
            ownerId: owner.id,
            name: pick(PET_NAMES),
            species: specEntry.s,
            breed: pick(specEntry.breeds),
            sex,
            dateOfBirth: dob,
            weight: parseFloat((rand(1, 45) + Math.random()).toFixed(1)),
            archivedAt: Math.random() < 0.05 ? randomDate(daysAgo(200), daysAgo(30)) : null,
            createdAt: owner.createdAt,
          },
        });
        pets.push(pet);
      }
    }
    process.stdout.write(`  ${Math.min(i + OWNER_BATCH, 1000)}/1000 owners\r`);
  }
  console.log(`\n  ${owners.length} owners, ${pets.length} pets created.`);

  // ── Appointments + Visits ──
  console.log('Creating appointments and visits (1 year)...');
  const activePets = pets.filter(p => !p.archivedAt);
  const yearAgo = daysAgo(365);
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  let apptCount = 0, visitCount = 0;

  // ~3 appointments per active pet on average over the year → ~4500 total
  const apptSample = pickN(activePets, Math.min(activePets.length, 1500));
  for (const pet of apptSample) {
    const numAppts = rand(1, 5);
    for (let a = 0; a < numAppts; a++) {
      const startsAt = randomDate(yearAgo, tomorrow);
      const isPast = startsAt < new Date();
      const status = isPast ? pick(APPT_STATUSES) : 'SCHEDULED';
      const apptId = cuid();

      await prisma.appointment.create({
        data: {
          id: apptId,
          ownerId: pet.ownerId,
          petId: pet.id,
          assignedUserId: Math.random() > 0.3 ? pick(allUsers).id : null,
          startsAt,
          type: pick(APPT_TYPES),
          reason: Math.random() > 0.4 ? `${pick(['Annual','Routine','Urgent','Follow-up'])} visit` : null,
          status,
          createdAt: new Date(startsAt.getTime() - rand(1, 7) * 86400000),
        },
      });
      apptCount++;

      if (status === 'COMPLETED') {
        const visitId = cuid();
        const hasFollowUp = Math.random() < 0.2;
        await prisma.visit.create({
          data: {
            id: visitId,
            appointmentId: apptId,
            ownerId: pet.ownerId,
            petId: pet.id,
            notes: pick(VISIT_NOTES),
            treatmentsSummary: pick(TREATMENTS),
            followUpAt: hasFollowUp ? randomDate(startsAt, new Date(startsAt.getTime() + 30 * 86400000)) : null,
            occurredAt: startsAt,
            createdAt: startsAt,
          },
        });
        visitCount++;
      }
    }
  }
  console.log(`  ${apptCount} appointments, ${visitCount} visits created.`);

  // ── Sales (1 year) ──
  console.log('Creating 1 year of sales...');
  const activeProducts = products.filter(p => p.active);
  let saleCount = 0, lineCount = 0;

  // ~8–12 sales per day → ~3650 sales per year
  const totalDays = 365;
  for (let day = 0; day < totalDays; day++) {
    const date = daysAgo(totalDays - day);
    const salesThisDay = rand(6, 14);
    for (let s = 0; s < salesThisDay; s++) {
      const occurredAt = new Date(date);
      occurredAt.setHours(rand(8, 19), rand(0, 59), rand(0, 59));

      const useOwner = Math.random() > 0.25;
      const owner = useOwner ? pick(owners) : null;
      const saleId = cuid();

      // 1–4 line items per sale
      const lineCount_ = rand(1, 4);
      const chosenProducts = pickN(activeProducts, lineCount_);
      const lines = chosenProducts.map(p => ({
        id: cuid(),
        saleId,
        productId: p.id,
        quantity: rand(1, 3),
        unitPrice: Number(p.price),
      }));
      const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
      const isVoided = Math.random() < 0.03;

      await prisma.sale.create({
        data: {
          id: saleId,
          ownerId: owner?.id ?? null,
          walkInName: !owner ? `Walk-in ${rand(1, 9999)}` : null,
          petId: null,
          paymentMethod: pick(PAYMENT_METHODS),
          total: parseFloat(total.toFixed(2)),
          status: isVoided ? 'VOIDED' : 'COMPLETED',
          soldByUserId: pick(allUsers).id,
          occurredAt,
          createdAt: occurredAt,
          lines: { createMany: { data: lines.map(({ saleId: _s, ...rest }) => rest) } },
        },
      });
      saleCount++;
      lineCount += lines.length;
    }
    if (day % 30 === 0) process.stdout.write(`  ${day}/${totalDays} days\r`);
  }
  console.log(`\n  ${saleCount} sales, ${lineCount} sale lines created.`);

  console.log('\nSeed complete!');
  console.log('  Login: admin@petshop.local / password123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
