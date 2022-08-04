import { Request, Response } from 'express';
import { Poll } from '../models/polls';

export const createPoll = async (req: Request, res: Response) => {
  const userId = req.currentUser?.id;
  const { topic } = req.body;
  const created_at = new Date();
  const updated_at = created_at;
  const poll = await Poll.create({
    user: userId,
    topic,
    created_at,
    updated_at,
  });

  await poll.save();

  res.status(201).send(poll);
};

export const getPollById = async (req: Request, res: Response) => {
  const { id: pollId } = req.params;

  Poll.findById(pollId)
    .populate('user')
    .populate('voted')
    .populate('options')
    .exec(function (err, poll) {
      if (err) {
        throw new Error('Poll not found');
      }

      res.status(200).send(poll);
    });
};

export const listAllPolls = async (req: Request, res: Response) => {
  const polls = await Poll.find({});

  res.send(polls);
};

export const listInprogressPolls = async (req: Request, res: Response) => {
  const polls = await Poll.find({ inProgress: true });

  res.send(polls);
};

export const updatePollById = async () => {};

export const startPoll = async (req: Request, res: Response) => {
  const { id: pollId } = req.params;
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new Error('Poll not found');
  }

  poll.set({
    inProgress: true,
    updated_at: new Date(),
  });

  await poll.save();

  res.status(201).send(poll);
};

export const stopPoll = async (req: Request, res: Response) => {
  const { id: pollId } = req.params;
  const poll = await Poll.findById(pollId);

   if (!poll) {
    throw new Error('Poll not found');
  }

  poll.set({
    inProgress: false,
    updated_at: new Date(),
  });

  await poll.save();

  res.status(201).send(poll);
};
