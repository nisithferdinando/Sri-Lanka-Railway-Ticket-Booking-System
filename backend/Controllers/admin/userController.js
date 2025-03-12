const express=require('express');
const User=require('../../models/User');

exports.getUsers=async(req, res)=>{
    try {
        
        const users = await User.find({}, { password: 0 });
        res.status(200).json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
      }
  };



