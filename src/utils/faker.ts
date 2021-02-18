import faker from "faker";
import { Route } from "@entities/Route";
import { Category } from "@entities/Category";
import { Location } from "@entities/Location";
import { Client } from "@entities/Client";
import { Event } from "@entities/Event";
import { GuidedInfo } from "@entities/GuidedInfo";
import { TehnicalInfo } from "@entities/TehnicalInfo";

let category_ids: Array<number> = [];
let location_ids: Array<number> = [];
let client_ids: Array<number> = [];

export default async () => {
  // await generateCategories();
  // await generateLocations();
  await generateClients();
  await generateEvents();
  await generateRoutes();
};

const getRandomId = (array: Array<number>) => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateCategories = async () => {
  for (let i = 0; i < 1; i++) {
    const category = Category.create({
      title: faker.commerce.productName(),
    });

    category.save();
  }

  const categories = await Category.find({ select: ["id"] });
  category_ids = categories.map((c) => c.id);
};

const generateLocations = async () => {
  for (let i = 0; i < 10; i++) {
    const location = Location.create({
      title: faker.address.county(),
      description: faker.lorem.words(),
    });

    location.save();
  }
};

const generateClients = async () => {
  for (let i = 0; i < 10; i++) {
    const client = Client.create({
      name: faker.company.companyName(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
    });

    client.save();
  }
};

const generateEvents = async () => {
  for (let i = 0; i < 50; i++) {
    const category = await Category.findOneOrFail(getRandomId(category_ids));
    const location = await Location.findOneOrFail(getRandomId(location_ids));

    const event = Event.create({
      title: faker.lorem.words(),
      text: faker.lorem.paragraph(),
      category,
      location,
    });

    event.save();
  }
};

const generateRoutes = async () => {
  const categories = await Category.find({ select: ["id"] });
  const locations = await Location.find({ select: ["id"] });
  const clients = await Client.find({ select: ["id"] });
  location_ids = locations.map((l) => l.id);
  category_ids = categories.map((c) => c.id);
  client_ids = clients.map((c) => c.id);

  for (let i = 0; i < 50; i++) {
    const category = await Category.findOneOrFail(getRandomId(category_ids));
    const location = await Location.findOneOrFail(getRandomId(location_ids));
    const client = await Client.findOneOrFail(getRandomId(client_ids));

    const route = Route.create({
      title: faker.lorem.words(),
      description: faker.lorem.words(),
      details: faker.lorem.paragraph(),
      fitness_level: faker.random.number(5),
      experience: faker.random.number(5),
      active: true,
      featured: faker.random.boolean(),
      categories: [category],
      location,
      client,
    });

    try {
      const response = await route.save();
      generateGuidedInfo(response);
      generateTehnicalInfo(response);
    } catch (e) {
      console.log(e);
    }
  }
};

const generateGuidedInfo = async (route: Route) => {
  const gi = GuidedInfo.create({
    age_min: faker.random.number(5),
    age_max: faker.random.number(90),
    starts_from: faker.address.streetAddress(true),
    people_min: faker.random.number(2),
    people_max: faker.random.number(30),
    accommodation: faker.lorem.paragraph(),
    meals: faker.lorem.paragraph(),
    transfer: faker.lorem.paragraph(),
    equipment: faker.lorem.paragraph(),
    insurance: faker.lorem.paragraph(),
    availability_from: faker.date.soon().toISOString(),
    availability_to: faker.date.future().toISOString(),
    discount: faker.lorem.paragraph(),
    cancelation_policy: faker.lorem.paragraph(),
    not_include: faker.lorem.paragraph(),
    additional_charge: faker.lorem.paragraph(),
    route,
  });

  gi.save();
};

const generateTehnicalInfo = async (route: Route) => {
  const ti = TehnicalInfo.create({
    elevation_min: faker.random.number(10),
    elevation_max: faker.random.number(3000),
    length: faker.random.number(10000),
    duration: faker.random.number(600),
    route,
  });

  try {
    ti.save();
  } catch (e) {
    console.log(e);
  }
};
