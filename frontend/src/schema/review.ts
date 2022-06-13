import * as yup from 'yup';

export const ReviewSchema = yup.object({
  content: yup.string().max(10000, '10000字以内で入力してください'),
  date: yup.date(),
  evaluation: yup.number(),
}).required();

export const ReviewUpdateSchema = yup.object({
  content: yup.string().max(10000, '10000字以内で入力してください')
}).required();