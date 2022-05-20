import * as crypto from 'crypto';
import {logger} from './logger';
import {Color, white} from 'kleur';
import {TLogLevelName} from 'tslog';
import {CRAWDL_HEADER, MAX_TTY_LENGTH} from './const';

export function headerFactory(
  color: Color = white,
  logLevel: TLogLevelName = 'info'
): void {
  logger()[logLevel](color(`${CRAWDL_HEADER}`));
}

export function getOutputWidth(): number {
  return process.stdout.columns
    ? Math.min(process.stdout.columns, MAX_TTY_LENGTH)
    : MAX_TTY_LENGTH;
}

export function randomString(length: number): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}
