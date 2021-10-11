import createError from 'http-errors';

export const validateCount = (count) => {
  if (isNaN(count)) throw new createError.Conflict('count');
};

export const validatePrice = (price) => {
  if (isNaN(price)) throw new createError.Conflict('price');
};
export const validateTitle = (title) => {
  if (typeof title !== 'string') throw new createError.Conflict(`title: ${title}`);
};

export const validateDescription = (description) => {
  if (typeof description !== 'string') throw new createError.Conflict('description');
};

export const validateSrc = (src) => {
  if (typeof src !== 'string' || !src.startsWith('https://')) throw new createError.Conflict('src');
};

export const validateNoFound = (item) => {
  if (!item) throw new createError.Conflict(`Parametr "${item}" was not found`);
};

export const validateBody = ({ title, price, count, description, src }) => {
  if (title === undefined) validateNoFound('title');
  if (price === undefined) validateNoFound('price');
  if (count === undefined) validateNoFound('count');
  if (description === undefined) validateNoFound('description');
  if (src === undefined) validateNoFound('src');

  validateTitle(title);
  validatePrice(price);
  validateCount(count);
  validateDescription(description);
  validateSrc(src);
};
