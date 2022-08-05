import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Poll } from '../models/polls';
import { Option } from '../models/options';

export const addOption = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw errors.array();
  }

  const { pollId, option } = req.body;
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new Error('Poll not found');
  }

  const created_at = new Date();
  const updated_at = created_at;
  const newOption = await Option.create({
    poll: pollId,
    option,
    created_at,
    updated_at,
  });
  await newOption.save();

  const options = poll.options;
  options.push(newOption.id);
  poll.set({
    options,
    updated_at,
  });
  await poll.save();

  res.status(201).send(newOption);
};

export const listAllOptions = async (req: Request, res: Response) => {
  const options = await Option.find().populate('poll');

  res.status(200).send(options);
};
