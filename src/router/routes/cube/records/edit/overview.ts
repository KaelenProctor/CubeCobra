import Joi from 'joi';

import Cube from '../../../../../dynamo/models/cube';
import Record from '../../../../../dynamo/models/record';
import { csrfProtection, ensureAuth } from '../../../../../routes/middleware';
import { Request, Response } from '../../../../../types/express';
import { isCubeEditable, isCubeViewable } from '../../../../../util/cubefn';
import { redirect } from '../../../../../util/render';
import { bodyValidation } from '../../../../middleware/bodyValidation';

// Define the JOI schema for the record object
const recordSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(), // Name must be a string with a reasonable length
  description: Joi.string().min(0).max(1000).optional(), // Description is optional but can be long
  date: Joi.number().optional(), // Date is optional, if provided must be a valid date
}).unknown(true); // allow additional properties

export const editRecordOverviewHandler = async (req: Request, res: Response) => {
  try {
    const record = await Record.getById(req.params.id);

    if (!record) {
      req.flash('danger', 'Record not found');
      return redirect(req, res, '/404');
    }

    const cube = await Cube.getById(record.cube);

    if (!isCubeViewable(cube, req.user)) {
      req.flash('danger', 'Cube not found');
      return redirect(req, res, '/404');
    }

    if (!isCubeEditable(cube, req.user)) {
      req.flash('danger', 'You do not have permission to edit a record for this cube');
      return redirect(req, res, '/404');
    }

    const updatedRecord = JSON.parse(req.body.record);

    record.name = updatedRecord.name;
    record.description = updatedRecord.description;
    record.date = updatedRecord.date;

    await Record.put(record);

    req.flash('success', 'Record updated successfully');
    return redirect(req, res, `/cube/record/${req.params.id}`);
  } catch {
    req.flash('danger', 'Error updating record');
    return redirect(req, res, `/cube/record/${req.params.id}`);
  }
};

export const routes = [
  {
    method: 'post',
    path: '/:id',
    handler: [
      csrfProtection,
      ensureAuth,
      bodyValidation(recordSchema, (req) => `/cube/record/${req.params.id}`, 'record'),
      editRecordOverviewHandler,
    ],
  },
];
