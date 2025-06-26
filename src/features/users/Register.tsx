// import React, { useState } from 'react';
// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { registerUser } from './userSlice';

// const Register = () => {
//   const dispatch = useAppDispatch();
//   const { loading, error } = useAppSelector(state => state.user);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     password2: '',
//   });

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const onSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (formData.password !== formData.password2) {
//       alert('Passwords do not match');
//       return;
//     }
//     dispatch(registerUser({ name: formData.name, email: formData.email, password: formData.password }));
//   };

//   return (
//     <form onSubmit={onSubmit}>
//       <input name="name" value={formData.name} onChange={onChange} placeholder="Name" required />
//       <input name="email" type="email" value={formData.email} onChange={onChange} placeholder="Email" required />
//       <input name="password" type="password" value={formData.password} onChange={onChange} placeholder="Password" required />
//       <input name="password2" type="password" value={formData.password2} onChange={onChange} placeholder="Confirm Password" required />
//       <button type="submit" disabled={loading}>Register</button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </form>
//   );
// };

// export default Register;
