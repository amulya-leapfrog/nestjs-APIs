import { User } from '@prisma/client';
import { DATE_FORMAT } from 'src/shared/constants/date';
import { DateTime } from 'luxon';
import { PaginationQuery } from 'src/shared/interface';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/shared/constants/pagination';

export const extractUserData = (data: User) => {
  return {
    id: data.id,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
  };
};

export const getCurrentTime = () => {
  const currentTime = DateTime.now().toUTC().toFormat(DATE_FORMAT);
  return currentTime;
};

export const getPaginationOptions = (option: PaginationQuery) => {
  const { page = DEFAULT_PAGE, size = DEFAULT_PAGE_SIZE } = option;

  const offset = Number((page - 1) * size);

  return {
    limit: Number(size),
    offset,
  };
};

export const buildMeta = (total: number, size?: number, page?: number) => {
  return {
    page: Number(page || DEFAULT_PAGE),
    size: Number(size || DEFAULT_PAGE_SIZE),
    total: Number(total),
  };
};
