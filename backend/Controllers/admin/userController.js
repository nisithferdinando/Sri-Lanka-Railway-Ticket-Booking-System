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

  exports.getAllUserCount=async(req, res)=>{
    try{
      const count= await User.countDocuments();
      res.status(200).json(count);

    }
    catch(error){
      res.status(500).json({error: true, message:"error in fetching user count"});
    }
  }



