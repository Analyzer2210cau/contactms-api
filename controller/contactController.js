import express from 'express'
import ConactModel from '../models/contactmodel.js'
import dotenv from 'dotenv';
dotenv.config()

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  try {

    const newcontact = new ConactModel({
      name,
      email,
      phone,
      postedby: req.user._id

    })

    const result = newcontact.save();
    return res.status(201).json({ success: true, ...result.doc })
  }
  catch (err) {
    return res.status(500).json(err.message)
  }
}

export const getContacts = async (req, res) => {

  try {
    const contacts = await ConactModel.find({ postedby: req.user._id })
    return res.status(200).json({ success: true, contacts: contacts })
  }
  catch (err) {
    console.log(err.message)
  }

}
export const getContact = async (req, res) => {

  const id = req.params.id;

  console.log(id)

  if (!id) {
    return res.status(401).json({ error: "No Id specified" })
  }

  try {
    const fetchedcontact = await ConactModel.findById(id)
    return res.status(200).json({ success: true, user: fetchedcontact })
  }
  catch (err) {
    console.log(err.message)
  }

}
export const updateContact = async (req, res) => {
  const id = req.params.id


  console.log("update operation")
  console.log(id)
  if (!id) {
    return res.status(401).json({ error: "No ID specified" })
  }
  try {



    const updatedcontact = await ConactModel.findByIdAndUpdate(id, { ...req.body }, { new: true })
    console.log(updateContact)

    if (updatedcontact) {
      return res.status(200).json({ success: true, message: "user updated successfully", user: updatedcontact })
    }
    else {
      return res.status(404).json({ success: false, message: "user no found" })
    }
  }
  catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}

export const deleteContact = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "No ID specified" });
  }

  try {
    const contact = await ConactModel.findById(id);

    if (!contact) {
      return res.status(404).json({ error: "Record does not exist" });
    }

    // Delete the contact
    await ConactModel.findByIdAndDelete(id);

    // Fetch updated list of contacts
    const contacts = await ConactModel.find({ postedby: req.user._id });

    return res.status(200).json({ success: true, contacts });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
