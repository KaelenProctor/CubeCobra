const { DefaultPrintingPreference } = require('../../datatypes/Card');
const { DefaultGridTightnessPreference } = require('../../datatypes/User');
const { getImageData } = require('../../util/imageutil');
const createClient = require('../util');

const FIELDS = {
  ID: 'id',
  USERNAME: 'username',
  USERNAME_LOWER: 'usernameLower',
  PASSWORD_HASH: 'passwordHash',
  EMAIL: 'email',
  ABOUT: 'about',
  HIDE_TAG_COLORS: 'hideTagColors',
  FOLLOWED_CUBES: 'followedCubes',
  FOLLOWED_USERS: 'followedUsers',
  USERS_FOLLOWING: 'following',
  IMAGE_NAME: 'imageName',
  ROLES: 'roles',
  THEME: 'theme',
  HIDE_FEATURED: 'hideFeatured',
  PATRON_ID: 'patron',
  DATE_CREATED: 'dateCreated',
};

const ROLES = {
  ADMIN: 'Admin',
  CONTENT_CREATOR: 'ContentCreator',
  PATRON: 'Patron',
};

const client = createClient({
  name: 'USERS',
  partitionKey: FIELDS.ID,
  attributes: {
    [FIELDS.ID]: 'S',
    [FIELDS.USERNAME_LOWER]: 'S',
    [FIELDS.EMAIL]: 'S',
  },
  indexes: [
    {
      partitionKey: FIELDS.USERNAME_LOWER,
      name: 'ByUsername',
    },
    {
      partitionKey: FIELDS.EMAIL,
      name: 'ByEmail',
    },
  ],
  FIELDS,
});

const stripSensitiveData = (user) => {
  if (!user) {
    return user;
  }

  delete user[FIELDS.PASSWORD_HASH];
  delete user[FIELDS.EMAIL];

  return user;
};

const batchStripSensitiveData = (users) => users.map(stripSensitiveData);

const hydrate = (user) => {
  if (!user) {
    return user;
  }

  user.image = getImageData(user.imageName || 'Ambush Viper');
  //Just nice to set the value instead of having undefined around
  if (!user.defaultPrinting) {
    user.defaultPrinting = DefaultPrintingPreference;
  }
  //Ensure a value is always set
  if (!user.gridTightness) {
    user.gridTightness = DefaultGridTightnessPreference;
  }
  if (typeof user.autoBlog === 'undefined') {
    user.autoBlog = false;
  }

  return user;
};

const batchHydrate = (users) => users.map(hydrate);

const getByUsername = async (username, lastKey) => {
  const result = await client.query({
    IndexName: 'ByUsername',
    KeyConditionExpression: `#p1 = :uname`,
    ExpressionAttributeValues: {
      ':uname': username.toLowerCase(),
    },
    ExpressionAttributeNames: {
      '#p1': FIELDS.USERNAME_LOWER,
    },
    ExclusiveStartKey: lastKey,
  });

  if (result.Items.length > 0) {
    return hydrate(stripSensitiveData(result.Items[0]));
  }

  return null;
};

module.exports = {
  getById: async (id) => hydrate(stripSensitiveData((await client.get(id)).Item)),
  getByIdWithSensitiveData: async (id) => (await client.get(id)).Item,
  getByUsername,
  getByIdOrUsername: async (idOrUsername) => {
    const result = await client.get(idOrUsername);

    if (result.Item) {
      return hydrate(stripSensitiveData(result.Item));
    }

    return getByUsername(idOrUsername);
  },
  getByEmail: async (email, lastKey) => {
    const result = await client.query({
      IndexName: 'ByEmail',
      KeyConditionExpression: `#p1 = :email`,
      ExpressionAttributeValues: {
        ':email': email.toLowerCase(),
      },
      ExpressionAttributeNames: {
        '#p1': FIELDS.EMAIL,
      },
      ExclusiveStartKey: lastKey,
    });

    if (result.Items.length > 0) {
      return hydrate(result.Items[0]);
    }

    return null;
  },
  update: async (document) => {
    if (!document[FIELDS.ID]) {
      throw new Error('Invalid document: No partition key provided');
    }

    const existing = await client.get(document[FIELDS.ID]);

    if (!existing.Item) {
      throw new Error('Invalid document: No existing document found');
    }

    for (const [key, value] of Object.entries(document)) {
      if (key !== FIELDS.ID) {
        existing.Item[key] = value;
      }
    }

    delete existing.Item.image;

    return client.put(existing.Item);
  },
  put: async (document) => {
    delete document.image;
    return client.put({
      [FIELDS.USERNAME_LOWER]: document[FIELDS.USERNAME].toLowerCase(),
      ...document,
    });
  },
  batchPut: async (documents) => {
    const existing = await client.batchGet(documents.map((doc) => doc[FIELDS.ID]));

    for (const item of existing) {
      const document = documents.find((doc) => doc[FIELDS.ID] === item[FIELDS.ID]);

      for (const [key, value] of Object.entries(document)) {
        if (key !== FIELDS.ID) {
          item[key] = value;
        }
      }
    }

    return client.batchPut(existing);
  },
  batchAdd: async (documents) => {
    return client.batchPut(documents);
  },
  deleteById: async (id) => client.delete({ id }),
  batchGet: async (ids) => batchHydrate(batchStripSensitiveData(await client.batchGet(ids.map((id) => `${id}`)))),
  createTable: async () => client.createTable(),
  convertUser: (user) => ({
    [FIELDS.ID]: `${user._id}`,
    [FIELDS.USERNAME]: user.username,
    [FIELDS.USERNAME_LOWER]: user.username_lower,
    [FIELDS.PASSWORD_HASH]: user.password,
    [FIELDS.EMAIL]: user.email.toLowerCase(),
    [FIELDS.ABOUT]: user.about,
    [FIELDS.HIDE_TAG_COLORS]: user.hide_tag_colors,
    [FIELDS.FOLLOWED_CUBES]: user.followed_cubes.map((id) => `${id}`),
    [FIELDS.FOLLOWED_USERS]: user.followed_users.map((id) => `${id}`),
    [FIELDS.USERS_FOLLOWING]: user.users_following.map((id) => `${id}`),
    [FIELDS.IMAGE_NAME]: user.image_name,
    [FIELDS.ROLES]: user.roles,
    [FIELDS.THEME]: user.theme,
    [FIELDS.HIDE_FEATURED]: user.hide_featured,
  }),
  ROLES,
  FIELDS,
};
