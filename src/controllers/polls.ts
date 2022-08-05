import { Request, Response } from 'express';
import { Poll } from '../models/polls';
import { User } from '../models/users';
import { Option } from '../models/options';

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

  await Poll.findById(pollId)
    .populate('user')
    .populate('voted')
    .populate('options')
    .exec(function (err, poll) {
      if (err || !poll) {
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

  if (poll.options.length < 2) {
    throw new Error('Options small than 2');
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

export const votePoll = async (req: Request, res: Response) => {
  const userId = req.currentUser?.id;
  const { id: pollId } = req.params;
  const { optionId } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const option = await Option.findById(optionId);

  if (!optionId) {
    throw new Error('No options provided');
  }

  if (!option) {
    throw new Error('Option not found');
  }

  const poll = await Poll.findById(pollId).populate('options');

  if (!poll) {
    throw new Error('Poll not found');
  }

  if (!poll.inProgress) {
    throw new Error('Poll not yet started');
  }

  const voted = poll.voted;
  const foundVoted = voted.find((elem) => {
    return elem.toString() === userId;
  });
  if (foundVoted) {
    throw new Error('User already voted');
  }
  voted.push(user.id);
  await poll.save();

  option.set({
    votes: option.votes + 1,
  });
  await option.save();

  res.status(200).send('Voted successfully');
};

export const resultPoll = async (req: Request, res: Response) => {
  const { id } = req.params;
  const poll = await Poll.findById(id).populate('options');

  if (!poll) {
    throw new Error('Poll not found');
  }

  if (poll.inProgress) {
    throw new Error('Poll on going');
  }

  const result = poll.options.map(async (id) => {
    console.log(id);
    const opt = await Option.findById(id.toString());
    return {
      option: opt?.option,
      votes: opt?.votes,
    };
  });

  res.status(200).send(result);
};
