import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Poll } from '../models/polls';
import { Option } from '../models/options';
import { Vote } from '../models/votes';

export const addVote = async (req: Request, res: Response) => {
  const { pollId, optionId } = req.body;
  const userId = req.currentUser!.id;
  const poll = await Poll.findById(pollId);
  const option = await Option.findById(optionId);
  const created_at = new Date();
  const updated_at = created_at;

  if (!poll) {
    throw new Error('Poll not found');
  }

  if (!option) {
    throw new Error('Option not found');
  }

  const foundOption = poll.options.find(
    (opt) => new mongoose.Types.ObjectId(opt._id).toString() === optionId
  );

  const existingVote = await Vote.find({ poll: pollId, user: userId });
  console.log(existingVote);
  if (existingVote.length > 0) {
    throw new Error(`User: ${userId} already vote`);
  }

  const vote = Vote.build({
    poll: new mongoose.Types.ObjectId(pollId),
    user: new mongoose.Types.ObjectId(userId),
    option: new mongoose.Types.ObjectId(optionId),
    created_at,
    updated_at,
  });
  await vote.save();

  res.status(201).send(vote);
};

export const getCurrentVotes = async (req: Request, res: Response) => {
  const { id: pollId } = req.params;
  const { page: pageQuery, limit: limitQuery } = req.query;
  const limit = parseInt(limitQuery as string, 10) || 10;
  const page = parseInt(pageQuery as string, 10) || 0;
  const skip = limit * page;
  const votes = await Vote.find({ poll: pollId }).skip(skip).limit(limit);
  const options = await Vote.aggregate([
    {
      $match: {
        poll: new mongoose.Types.ObjectId(pollId),
      },
    },
    {
      $group: {
        _id: '$option',
        // options: { $push: '$option' },
        total: { $sum: 1 }, // this means that the count will increment by 1
      },
    },
  ]);
  await Option.populate(options, { path: '_id' });

  res.status(200).send({ options, votes });
};

export const listVotesByPollId = async (req: Request, res: Response) => {
  const { pollId } = req.body;
  const { page: pageQuery, limit: limitQuery } = req.query;
  const limit = parseInt(limitQuery as string, 10) || 10;
  const page = parseInt(pageQuery as string, 10) || 0;
  const skip = limit * page;
  const votes = await Vote.find({ poll: pollId }).skip(skip).limit(limit);

  res.status(200).send(votes);
};

export const getVoteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const vote = await Vote.findById(id)
    .populate('poll')
    .populate('user')
    .populate('option');

  res.status(200).send(vote);
};

export const getVoteResult = async (req: Request, res: Response) => {
  const { id: pollId } = req.params;
  const votes = await Vote.aggregate([
    {
      $match: {
        poll: new mongoose.Types.ObjectId(pollId),
      },
    },
    // {
    //   $group: {
    //     _id: '$option',
    //     total: { $sum: 1 }, // this means that the count will increment by 1
    //   },
    // },
  ]);

  res.status(200).send(votes);
};
