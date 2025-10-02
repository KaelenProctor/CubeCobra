import User from '../../../dynamo/models/user';
import { csrfProtection, ensureAuth } from '../../../routes/middleware';
import { Request, Response } from '../../../types/express';

export const handler = async (req: Request, res: Response) => {
  const { user } = req;
  const preference = req.body.preference;

  if (!user) {
    return res.status(401).send({
      error: 'User not authenticated',
    });
  }

  if (typeof preference !== 'boolean') {
    return res.status(400).send({
      error: 'Invalid preference value',
    });
  }

  const userToUpdate = await User.getById(user.id);

  if (!userToUpdate) {
    return res.status(404).send({
      success: 'false',
    });
  }
  userToUpdate.consentToHashedEmail = preference;
  await User.update(userToUpdate);

  return res.status(200).send({
    success: 'true',
  });
};

export const routes = [
  {
    method: 'post',
    path: '/',
    handler: [csrfProtection, ensureAuth, handler],
  },
];
