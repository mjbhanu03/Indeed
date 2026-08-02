import * as Yup from 'yup';

export const eventSchema = Yup.object({
  title: Yup.string().min(3, 'Min 3 characters').required('Title is required'),
  description: Yup.string().min(10, 'Min 10 characters'),
  location: Yup.string().required('Location is required'),
  // date: Yup.date()
  //   .min(
  //     () => new Date(new Date().setHours(0, 0, 0, 0)),
  //     'Date must be today or in the future'
  //   )
  //   .required('Date is required'),
  time: Yup.string().required('Time is required'),
  ticket_price: Yup.number().min(0, 'Price cannot be negative').required('Ticket price is required'),
  total_seats: Yup.number().min(1, 'At least 1 seat required').required('Total seats required'),
  category: Yup.string().required('Category is required'),
});
