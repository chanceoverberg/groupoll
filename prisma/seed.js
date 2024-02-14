const { PrismaClient } = require("@prisma/client");
const { categories, products, surveyGroups, surveys, options } = require("./data.js");
const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.product.deleteMany();
    console.log("Deleted records in product table");

    await prisma.category.deleteMany();
    console.log("Deleted records in category table");

    await prisma.option.deleteMany();
    console.log("Deleted records in option table");

    await prisma.survey.deleteMany();
    console.log("Deleted records in survey table");

    await prisma.surveyGroup.deleteMany();
    console.log("Deleted records in SurveyGroup table");

    await prisma.$queryRaw`ALTER TABLE Product AUTO_INCREMENT = 1`;
    console.log("reset product auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE Category AUTO_INCREMENT = 1`;
    console.log("reset category auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE SurveyGroup AUTO_INCREMENT = 1`;
    console.log("reset SurveyGroup auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE Survey AUTO_INCREMENT = 1`;
    console.log("reset survey auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE Option AUTO_INCREMENT = 1`;
    console.log("reset option auto increment to 1");

    await prisma.category.createMany({
      data: categories,
    });
    console.log("Added category data");

    await prisma.product.createMany({
      data: products,
    });
    console.log("Added product data");

    await prisma.surveyGroup.createMany({
      data: surveyGroups,
    });
    console.log("Added surveyGroup data");

    await prisma.survey.createMany({
      data: surveys,
    });
    console.log("Added survey data");

    await prisma.option.createMany({
      data: options,
    });
    console.log("Added option data");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
