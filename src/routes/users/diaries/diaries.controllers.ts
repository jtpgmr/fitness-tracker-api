import { NextFunction, Request, Response } from 'express';
import { generateUuid } from '#Api/helpers';
import { RecordConflictError, RecordNotFoundError } from '#Api/errors';
import Diary from './diaries.entities';
import { diariesRepository } from '#Api/DataSource';
import { app } from '#Api/config/uuidSegments.json';

