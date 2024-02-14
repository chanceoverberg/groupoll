const { Prisma } = require("@prisma/client");

const categories = [
  {
    name: "Hats",
    description: "Things you can wear on your head",
  },
  {
    name: "Socks",
    description: "Things you can wear on your feet",
  },
  {
    name: "Shirts",
    description: "Things you wear on the top half of your body",
  },
];

const products = [
  {
    name: "Cool helmet.",
    description: "A nice helmet to wear on your head",
    price: new Prisma.Decimal(19.95),
    image: "/images/helmet.jpg",
    category_id: 1,
  },
  {
    name: "Grey T-Shirt",
    description: "A nice shirt that you can wear on your body",
    price: new Prisma.Decimal(22.95),
    image: "/images/shirt.jpg",
    category_id: 3,
  },
  {
    name: "Socks",
    description: "Cool socks that you can wear on your feet",
    price: new Prisma.Decimal(12.95),
    image: "/images/socks.jpg",
    category_id: 2,
  },
  {
    name: "Sweatshirt",
    description: "Cool sweatshirt that you can wear on your body",
    price: new Prisma.Decimal(12.95),
    image: "/images/sweatshirt.jpg",
    category_id: 3,
  },
];

const surveyGroups = [
  {
    name: "Group 1",
    urlId: "asdf1",
  },
  {
    name: "Group 2",
    urlId: "asdf2",
  },
];

const surveys = [
  {
    urlId: 1,
    question: "What is your favorite color?",
    surveyGroupId: 1,
  },
  {
    urlId: 2,
    question: "What is your favorite animal?",
    surveyGroupId: 2,
  },
  {
    urlId: 3,
    question: "Do you like cats?",
    surveyGroupId: 2,
  },
];

const options = [
  {
    option: "blue",
    surveyId: 1,
  },
  {
    option: "red",
    surveyId: 1,
  },
  {
    option: "green",
    surveyId: 1,
  },
  {
    option: "purple",
    surveyId: 1,
  },
  {
    option: "dog",
    surveyId: 2,
  },
  {
    option: "cat",
    surveyId: 2,
  },
  {
    option: "cow",
    surveyId: 2,
  },
  {
    option: "yes",
    surveyId: 3,
  },
  {
    option: "no",
    surveyId: 3,
  },
];

module.exports = {
  products,
  categories,
  surveyGroups,
  surveys,
  options,
};
